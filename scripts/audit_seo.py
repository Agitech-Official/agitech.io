#!/usr/bin/env python3
"""Audit SEO de agitech.io : build statique (--dist) ou site en ligne (--base).

Bibliothèque standard uniquement (Python 3.9+).

  python3 scripts/audit_seo.py --dist dist --csv seo/titles-metas.csv
  python3 scripts/audit_seo.py --base https://agitech.io --csv seo/titles-metas.csv

Sorties : résumé console, seo-report.json (pour les outils) et seo-report.md (pour les humains).
Code de sortie : 1 s'il reste au moins un FAIL (ou un WARN avec --fail-on WARN), 2 si le site est illisible.
"""
import argparse, csv, json, os, re, sys, urllib.request, urllib.error
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin

HOST = "agitech.io"
UA = {"User-Agent": "Mozilla/5.0 (compatible; agitech-seo-audit/2.0)"}
LEGACY = ["/fr_be/", "/case-study/", "wp-content", "/en/home-page", "/industries-international-associations"]
LEGACY_REDIRECT_SOURCES = ["fr_be/home-page", "en/home-page", "case-study"]
GLOBAL_LINK_SHARE = 0.6

R = {  # règle: (gravité, consigne de correction pour Claude Code)
    "wp-leftover": ("FAIL", "Page encore servie par l'ancien WordPress (wp-content, Site Kit) : corriger le routage, le proxy ou le cache, pas le contenu."),
    "title-missing": ("FAIL", "Ajouter le title depuis seo/titles-metas.csv (source unique), 60 caractères max."),
    "title-long": ("WARN", "Raccourcir le title à 60 caractères maximum."),
    "title-dup": ("FAIL", "Rendre le title unique par page et par langue."),
    "meta-missing": ("FAIL", "Ajouter la meta description depuis seo/titles-metas.csv, 155 caractères max."),
    "meta-long": ("WARN", "Raccourcir la meta description à 155 caractères."),
    "meta-dup": ("WARN", "Rendre la meta description unique."),
    "csv-mismatch": ("FAIL", "Aligner title/meta sur seo/titles-metas.csv (ou mettre le CSV à jour si le changement est voulu, avec accord du propriétaire)."),
    "csv-page-missing": ("WARN", "La page du CSV n'existe pas dans le build : vérifier le routage ou corriger le CSV."),
    "canonical-missing": ("FAIL", "Ajouter <link rel=canonical> auto-référente, absolue, en https."),
    "canonical-mismatch": ("FAIL", "La canonical doit pointer vers l'URL de la page elle-même."),
    "h1-count": ("FAIL", "Exactement un <h1> non vide par page (le logo n'est pas un h1). Corriger les gabarits sans changer le texte visible."),
    "heading-skip": ("WARN", "Ne pas sauter de niveau de titre (h2 puis h4)."),
    "html-lang": ("WARN", "Mettre <html lang> à fr-BE, en ou nl-BE selon la langue de la page."),
    "og-missing": ("WARN", "Ajouter og:title, og:description, og:image, og:type et og:locale."),
    "og-locale": ("WARN", "og:locale doit être fr_BE, en_US ou nl_BE selon la langue."),
    "og-type-article": ("FAIL", "Articles : og:type = article."),
    "og-image-default": ("WARN", "Articles : utiliser l'image à la une de l'article, avec og-default.png en repli seulement."),
    "article-meta": ("FAIL", "Articles : article:published_time, article:modified_time et auteur (meta et JSON-LD) à partir des données du contenu. Ne jamais les deviner : lister ceux qui manquent."),
    "jsonld-invalid": ("FAIL", "Corriger le JSON-LD invalide (JSON.parse doit passer)."),
    "jsonld-missing": ("FAIL", "Ajouter les blocs JSON-LD de seo/jsonld.md pour ce type de page."),
    "faq-schema": ("WARN", "FAQ visible sans FAQPage : ajouter le JSON-LD avec le texte exactement identique à la page."),
    "hreflang-missing": ("FAIL", "Ajouter les hreflang (fr-BE, en, nl-BE, x-default) dans le head, vers des URLs existantes."),
    "hreflang-head-missing": ("WARN", "hreflang seulement dans le sitemap : valide pour Google, mais ajouter aussi dans le head."),
    "hreflang-incomplete": ("WARN", "Le jeu hreflang doit couvrir toutes les versions existantes et la page elle-même."),
    "hreflang-xdefault": ("WARN", "Ajouter hreflang=x-default vers la version FR."),
    "hreflang-target-missing": ("FAIL", "hreflang vers une URL inexistante : corriger ou retirer."),
    "hreflang-reciprocal": ("WARN", "Les hreflang doivent être réciproques entre versions."),
    "noindex": ("INFO", "Page en noindex : vérifier que c'est voulu."),
    "noindex-in-sitemap": ("FAIL", "Page noindex présente dans le sitemap : la retirer."),
    "img-alt": ("WARN", "Ajouter un attribut alt aux images (alt=\"\" si décorative)."),
    "img-size": ("INFO", "Ajouter width et height aux images pour éviter le décalage de mise en page."),
    "link-broken": ("FAIL", "Lien interne vers une page inexistante : corriger la cible."),
    "link-legacy": ("FAIL", "Lien interne vers une ancienne URL (/fr_be/, /case-study/, wp-content…) : pointer vers la nouvelle URL."),
    "asset-missing": ("WARN", "Image locale introuvable dans le build."),
    "orphan": ("WARN", "Page sans lien interne entrant : la relier depuis une page pertinente (blog, solution, liste)."),
    "thin": ("WARN", "Contenu court pour un article : à étoffer par le propriétaire, ne pas rédiger sans demande."),
    "wrong-language": ("WARN", "Le texte semble écrit dans une autre langue que celle de l'URL : version non traduite ?"),
    "pme-vocab": ("WARN", "Title/meta avec « PME » alors que le texte de la page n'en parle pas : règle du propriétaire, « PME » seulement si la page parle de PME."),
    "sitemap-missing": ("FAIL", "Aucun sitemap lisible."),
    "sitemap-page-missing": ("FAIL", "Page indexable absente du sitemap."),
    "sitemap-url-404": ("FAIL", "URL du sitemap inexistante dans le build : la retirer ou créer la page."),
    "sitemap-lastmod": ("WARN", "Ajouter lastmod (date de modification du contenu, pas du build)."),
    "sitemap-xdefault": ("WARN", "Ajouter x-default aux groupes hreflang du sitemap."),
    "sitemap-legacy": ("FAIL", "URL legacy dans le sitemap (/case-study/, /fr_be/…) : la retirer."),
    "robots-missing": ("FAIL", "robots.txt absent."),
    "robots-sitemap": ("FAIL", "robots.txt doit déclarer le sitemap."),
    "robots-blocks-linked": ("WARN", "Chemin en Disallow mais lié depuis le site : choisir entre autoriser et noindex (décision du propriétaire)."),
    "llms-missing": ("WARN", "Créer /llms.txt à partir des pages réelles (faits présents sur le site uniquement)."),
    "404-missing": ("WARN", "Ajouter une page 404 propre."),
    "redirect-config-missing": ("WARN", "Aucune configuration de redirections trouvée : ajouter celle de seo/redirects.md."),
    "redirect-missing": ("FAIL", "Redirection 301 absente : ajouter la règle de seo/redirects.md."),
    "redirect-live": ("FAIL", "L'ancienne URL ne renvoie pas un 301 vers la bonne cible."),
}

STOP = {
    "fr": set("le la les des du pour vous nous est une dans sur avec votre vos qui que aux cette ses sont par pas plus mais comme".split()),
    "en": set("the and for with your our that this are you from by it to".split()),
    "nl": set("het een van voor met uw wij niet ook dat deze zijn aan als door uit naar bij u je".split()),
}
LANG_HREF = {"fr-be": "fr", "fr": "fr", "en": "en", "nl-be": "nl", "nl": "nl"}
LOCALES = {"fr": {"fr_be"}, "en": {"en_us", "en_gb", "en"}, "nl": {"nl_be"}}


def key(p):
    p = urlparse(p).path or "/"
    if not p.startswith("/"):
        p = "/" + p
    return p.rstrip("/") or "/"


def lang_of(k):
    return "en" if k == "/en" or k.startswith("/en/") else "nl" if k == "/nl" or k.startswith("/nl/") else "fr"


def base_of(k):
    for pre in ("/en", "/nl"):
        if k == pre:
            return "/"
        if k.startswith(pre + "/"):
            return k[len(pre):]
    return k


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = ""; self.title = ""; self.meta = {}; self.links = []; self.h = []; self.imgs = []
        self.a = []; self.ld = []; self.all_text = []; self.main_text = []; self.details = 0
        self._t = False; self._ld = False; self._skip = 0; self._main = 0; self._h = None; self._hbuf = []

    def handle_starttag(self, tag, at):
        d = dict(at)
        if tag == "html":
            self.lang = d.get("lang", "")
        elif tag == "title":
            self._t = True
        elif tag == "meta":
            k = (d.get("name") or d.get("property") or "").lower()
            if k:
                self.meta.setdefault(k, d.get("content", ""))
        elif tag == "link":
            self.links.append((d.get("rel", "").lower(), d.get("hreflang", ""), d.get("href", "")))
        elif tag == "script":
            if "ld+json" in d.get("type", "").lower():
                self._ld = True; self.ld.append("")
            else:
                self._skip += 1
        elif tag in ("style", "noscript"):
            self._skip += 1
        elif tag == "main":
            self._main += 1
        elif tag == "details":
            self.details += 1
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._h = int(tag[1]); self._hbuf = []
        elif tag == "img":
            if self._h is not None and d.get("alt"):
                self._hbuf.append(d.get("alt"))  # un h1 contenant seulement le logo reste "vide"
            self.imgs.append((d.get("src", ""), d.get("alt"), d.get("width"), d.get("height")))
        elif tag == "a" and d.get("href"):
            self.a.append(d["href"])

    def handle_endtag(self, tag):
        if tag == "title":
            self._t = False
        elif tag == "script":
            if self._ld:
                self._ld = False
            elif self._skip:
                self._skip -= 1
        elif tag in ("style", "noscript") and self._skip:
            self._skip -= 1
        elif tag == "main" and self._main:
            self._main -= 1
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._h is not None:
            self.h.append((self._h, " ".join("".join(self._hbuf).split())))
            self._h = None

    def handle_data(self, data):
        if self._t:
            self.title += data
        elif self._ld:
            self.ld[-1] += data
        elif not self._skip:
            self.all_text.append(data)
            if self._main:
                self.main_text.append(data)
            if self._h is not None:
                self._hbuf.append(data)


class Page:
    pass


def analyze(path, raw):
    p = P()
    try:
        p.feed(raw)
    except Exception:
        pass
    g = Page()
    g.path = path; g.key = key(path); g.raw = raw; g.p = p
    g.title = " ".join(p.title.split())
    g.desc = " ".join(p.meta.get("description", "").split())
    g.canon = next((h for r, hl, h in p.links if "canonical" in r), "")
    g.alts = {}
    for r, hl, h in p.links:
        if "alternate" in r and hl:
            g.alts[hl.lower()] = key(h)
    g.text = " ".join(" ".join(p.main_text or p.all_text).split())
    g.words = re.findall(r"[A-Za-zÀ-ÿ']+", g.text.lower())
    g.links = set()
    for href in p.a:
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        u = urlparse(urljoin("https://%s%s" % (HOST, path), href))
        if u.netloc.replace("www.", "") == HOST:
            g.links.add((u.path or "/"))
    g.ld = []
    g.ld_bad = 0
    for b in p.ld:
        try:
            g.ld.append(json.loads(b))
        except Exception:
            g.ld_bad += 1
    g.types = set(ld_types(g.ld))
    g.noindex = "noindex" in p.meta.get("robots", "").lower()
    return g


def has_key(node, k):
    if isinstance(node, dict):
        return k in node or any(has_key(v, k) for v in node.values())
    if isinstance(node, list):
        return any(has_key(v, k) for v in node)
    return False


def ld_types(node):
    if isinstance(node, dict):
        t = node.get("@type")
        for x in (t if isinstance(t, list) else [t] if t else []):
            yield x
        for v in node.values():
            yield from ld_types(v)
    elif isinstance(node, list):
        for v in node:
            yield from ld_types(v)


class Dist:
    def __init__(self, root):
        self.root = root; self.live = False

    def pages(self):
        out = {}
        for d, _, fs in os.walk(self.root):
            for f in fs:
                if not f.endswith(".html") or f == "404.html":
                    continue
                full = os.path.join(d, f)
                rel = "/" + os.path.relpath(full, self.root).replace(os.sep, "/")
                path = rel[: -len("index.html")] if rel.endswith("/index.html") or rel == "/index.html" else rel[:-5]
                with open(full, encoding="utf-8", errors="replace") as fh:
                    out[path or "/"] = fh.read()
        return out

    def read(self, rel):
        try:
            with open(os.path.join(self.root, rel.lstrip("/")), encoding="utf-8", errors="replace") as fh:
                return fh.read()
        except OSError:
            return None

    def file_exists(self, path):
        pth = os.path.join(self.root, path.lstrip("/"))
        return os.path.isfile(pth) or os.path.isfile(os.path.join(pth, "index.html"))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def http(url, follow=True):
    op = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    try:
        r = op.open(urllib.request.Request(url, headers=UA), timeout=25)
        return r.status, dict(r.headers), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), ""
    except Exception as e:
        return 0, {}, str(e)


class Live:
    def __init__(self, base, limit, workers):
        self.base = base.rstrip("/"); self.limit = limit; self.workers = workers; self.live = True
        self._pages = None

    def read(self, rel):
        s, _, t = http(self.base + "/" + rel.lstrip("/"))
        return t if s == 200 else None

    def sitemap_paths(self):
        paths = []
        for rel in ("sitemap-index.xml", "sitemap.xml"):
            t = self.read(rel)
            if not t:
                continue
            for m in re.findall(r"<loc>(.*?)</loc>", t):
                if m.endswith(".xml"):
                    t2 = self.read(urlparse(m).path)
                    paths += [urlparse(x).path for x in re.findall(r"<loc>(.*?)</loc>", t2 or "")]
                else:
                    paths.append(urlparse(m).path)
            break
        return paths

    def pages(self):
        paths = self.sitemap_paths()[: self.limit]
        def get(p):
            s, _, t = http(self.base + p)
            return p, (t if s == 200 else None)
        with ThreadPoolExecutor(self.workers) as ex:
            res = dict(ex.map(get, paths))
        self._pages = {p for p, t in res.items() if t}
        return {p: t for p, t in res.items() if t}

    def file_exists(self, path):
        return False


def audit(src, args):
    issues = []

    def add(rule, path, msg):
        issues.append({"rule": rule, "severity": R[rule][0], "path": path, "message": msg, "fix": R[rule][1]})

    raw_pages = src.pages()
    if not raw_pages:
        print("Aucune page lue : vérifiez --dist ou --base.")
        sys.exit(2)
    pages = {}
    for path, raw in raw_pages.items():
        g = analyze(path, raw)
        pages[g.key] = g
    keys = set(pages)

    def exists(k):
        return k in keys or src.file_exists(k)

    # --- sitemap
    sm = {}  # key -> {"lastmod":..., "alts": set}
    idx = src.read("sitemap-index.xml") or src.read("sitemap.xml")
    sm_texts = []
    if idx:
        try:
            root = ET.fromstring(idx)
            tag = root.tag.split("}")[-1]
            if tag == "sitemapindex":
                for e in root.iter():
                    if e.tag.split("}")[-1] == "loc" and e.text:
                        t = src.read(urlparse(e.text.strip()).path)
                        if t:
                            sm_texts.append(t)
            else:
                sm_texts.append(idx)
        except ET.ParseError:
            pass
    if not sm_texts:
        add("sitemap-missing", "/sitemap-index.xml", "Aucun sitemap lisible.")
    for t in sm_texts:
        try:
            root = ET.fromstring(t)
        except ET.ParseError:
            add("sitemap-missing", "/sitemap", "Sitemap XML invalide.")
            continue
        for u in root.iter():
            if u.tag.split("}")[-1] != "url":
                continue
            loc = lastmod = None; alts = set()
            for c in u:
                n = c.tag.split("}")[-1]
                if n == "loc":
                    loc = (c.text or "").strip()
                elif n == "lastmod":
                    lastmod = (c.text or "").strip()
                elif n == "link" and c.attrib.get("hreflang"):
                    alts.add(c.attrib["hreflang"].lower())
            if loc:
                sm[key(loc)] = {"lastmod": lastmod, "alts": alts, "loc": loc}

    if sm:
        no_lastmod = [k for k, v in sm.items() if not v["lastmod"]]
        if no_lastmod:
            add("sitemap-lastmod", "/sitemap", "%d URLs sans lastmod (ex. %s)" % (len(no_lastmod), ", ".join(sorted(no_lastmod)[:3])))
        groups_no_x = [k for k, v in sm.items() if v["alts"] and "x-default" not in v["alts"]]
        if groups_no_x:
            add("sitemap-xdefault", "/sitemap", "%d URLs avec hreflang mais sans x-default" % len(groups_no_x))
        for k in sm:
            if any(l in k + "/" for l in ("/case-study/", "/fr_be/")):
                add("sitemap-legacy", k, "URL legacy dans le sitemap : %s" % sm[k]["loc"])
            if not exists(k):
                add("sitemap-url-404", k, "URL du sitemap absente du site")
        for k, g in pages.items():
            if g.noindex:
                if k in sm:
                    add("noindex-in-sitemap", k, "Page noindex listée dans le sitemap")
            elif k not in sm:
                add("sitemap-page-missing", k, "Page absente du sitemap")

    # --- robots, llms, 404
    robots = src.read("robots.txt")
    disallow = []
    if robots is None:
        add("robots-missing", "/robots.txt", "robots.txt introuvable")
    else:
        if not re.search(r"(?im)^sitemap:", robots):
            add("robots-sitemap", "/robots.txt", "Aucune ligne Sitemap:")
        disallow = [l.split(":", 1)[1].strip() for l in robots.splitlines() if l.lower().startswith("disallow:") and l.split(":", 1)[1].strip()]
    if src.read("llms.txt") is None:
        add("llms-missing", "/llms.txt", "llms.txt introuvable")
    if not src.live and src.read("404.html") is None:
        add("404-missing", "/404.html", "Page 404 absente du build")

    # --- graphe de liens, liens globaux (menu, pied de page), articles
    inbound = defaultdict(set)
    for k, g in pages.items():
        for l in g.links:
            if key(l) != k:
                inbound[key(l)].add(k)
    cnt = Counter(key(l) for g in pages.values() for l in g.links)
    glob = {k for k, n in cnt.items() if len(pages) >= 5 and n >= GLOBAL_LINK_SHARE * len(pages)}
    blog_idx = {k for k in keys if base_of(k) == "/blog"}
    articles = set()
    for b in blog_idx:
        articles |= {key(l) for l in pages[b].links} - glob - blog_idx
    articles = {a for a in articles if a in keys and a not in ("/", "/en", "/nl")}
    articles |= {k for k, g in pages.items() if g.p.meta.get("og:type") == "article"}
    homes = {"/", "/en", "/nl"}

    # --- groupes de traductions
    groups = defaultdict(dict)
    for k in keys:
        groups[base_of(k)][lang_of(k)] = k

    titles = defaultdict(list); descs = defaultdict(list)
    for k, g in sorted(pages.items()):
        L = lang_of(k); disp = g.path
        if g.raw and ("wp-content" in g.raw or "Site Kit by Google" in g.raw):
            add("wp-leftover", disp, "wp-content / Site Kit détecté dans le HTML")
        # title / meta
        if not g.title:
            add("title-missing", disp, "Pas de <title>")
        else:
            titles[g.title].append(disp)
            if len(g.title) > 60:
                add("title-long", disp, "%d caractères : %s" % (len(g.title), g.title))
        if not g.desc:
            add("meta-missing", disp, "Pas de meta description")
        else:
            descs[g.desc].append(disp)
            if len(g.desc) > 155:
                add("meta-long", disp, "%d caractères" % len(g.desc))
        n_pme = len(re.findall(r"\bPME", g.text))
        if re.search(r"\bPME", g.title + " " + g.desc) and n_pme < 3:
            add("pme-vocab", disp, "« PME » dans title/meta mais %d occurrence(s) dans le texte" % n_pme)
        # canonical
        if not g.canon:
            add("canonical-missing", disp, "Pas de canonical")
        else:
            cu = urlparse(g.canon)
            if cu.scheme != "https" or key(g.canon) != k:
                add("canonical-mismatch", disp, "canonical = %s" % g.canon)
        # titres
        h1 = [t for lvl, t in g.p.h if lvl == 1]
        good = [t for t in h1 if t]
        if len(good) != 1:
            add("h1-count", disp, "%d h1 non vide(s) sur %d h1" % (len(good), len(h1)))
        levels = [lvl for lvl, _ in g.p.h]
        if any(b - a > 1 for a, b in zip(levels, levels[1:])):
            add("heading-skip", disp, "Saut de niveau de titre")
        # langue
        if g.p.lang and not g.p.lang.lower().startswith(L):
            add("html-lang", disp, "<html lang=%s> pour une page %s" % (g.p.lang, L))
        elif not g.p.lang:
            add("html-lang", disp, "<html lang> absent")
        if len(g.words) >= 60:
            sc = {l: sum(1 for w in g.words if w in s) for l, s in STOP.items()}
            dom = max(sc, key=sc.get)
            if dom != L and sc[dom] > 1.3 * max(sc[L], 1):
                add("wrong-language", disp, "Texte plutôt %s (%d mots-outils) que %s (%d)" % (dom, sc[dom], L, sc[L]))
        # open graph
        m = g.p.meta
        miss = [x for x in ("og:title", "og:description", "og:image", "og:type", "og:locale") if not m.get(x)]
        if miss:
            add("og-missing", disp, "Manque : " + ", ".join(miss))
        if m.get("og:locale") and m["og:locale"].lower() not in LOCALES[L]:
            add("og-locale", disp, "og:locale=%s" % m["og:locale"])
        # robots meta
        if g.noindex:
            add("noindex", disp, "meta robots noindex")
        # images
        noalt = [i for i in g.p.imgs if i[1] is None]
        if noalt:
            add("img-alt", disp, "%d image(s) sans alt" % len(noalt))
        nosize = [i for i in g.p.imgs if i[2] is None or i[3] is None]
        if nosize and len(nosize) > 2:
            add("img-size", disp, "%d image(s) sans width/height" % len(nosize))
        if not src.live:
            gone = [i[0] for i in g.p.imgs if i[0].startswith("/") and not src.file_exists(urlparse(i[0]).path)]
            if gone:
                add("asset-missing", disp, "%d image(s) locales introuvables, ex. %s" % (len(gone), gone[0]))
        # liens
        for l in sorted(g.links):
            if any(x in l + ("" if l.endswith("/") else "/") for x in LEGACY):
                add("link-legacy", disp, "lien vers %s" % l)
            elif not exists(key(l)) and not os.path.splitext(l)[1]:
                add("link-broken", disp, "lien vers %s (inexistant)" % l)
        # orphelines
        if k not in homes and k not in glob and not inbound.get(k):
            add("orphan", disp, "Aucun lien entrant")
        # type de page
        is_art = k in articles
        is_home = k in homes
        if is_art:
            if m.get("og:type") != "article":
                add("og-type-article", disp, "og:type=%s" % m.get("og:type"))
            if "og-default" in m.get("og:image", ""):
                add("og-image-default", disp, "og:image = image par défaut")
            absent = []
            if not m.get("article:published_time"):
                absent.append("article:published_time")
            if not m.get("article:modified_time"):
                absent.append("article:modified_time")
            if not (m.get("author") or m.get("article:author") or has_key(g.ld, "author")):
                absent.append("auteur")
            if absent:
                add("article-meta", disp, "Manque : " + ", ".join(absent))
            if len(g.words) < 400:
                add("thin", disp, "%d mots" % len(g.words))
        # JSON-LD
        if g.ld_bad:
            add("jsonld-invalid", disp, "%d bloc(s) JSON-LD invalide(s)" % g.ld_bad)
        need = set()
        if is_home:
            need = {"Organization", "WebSite"}
        elif is_art:
            need = {"Article", "BreadcrumbList"}
        have = set(g.types) | ({"Article"} if g.types & {"BlogPosting", "NewsArticle"} else set())
        lack = need - have
        if lack:
            add("jsonld-missing", disp, "Types manquants : " + ", ".join(sorted(lack)))
        faq = g.p.details >= 2 or any(re.search(r"faq|veelgestelde|questions? fréquentes|frequently asked", t, re.I) for _, t in g.p.h)
        if faq and "FAQPage" not in g.types:
            add("faq-schema", disp, "FAQ visible sans FAQPage")
        # hreflang
        grp = groups[base_of(k)]
        if len(grp) > 1:
            declared = {LANG_HREF.get(c, c): v for c, v in g.alts.items() if c != "x-default"}
            if not g.alts:
                if sm.get(k, {}).get("alts"):
                    add("hreflang-head-missing", disp, "hreflang présent dans le sitemap seulement")
                else:
                    add("hreflang-missing", disp, "Aucun hreflang (versions existantes : %s)" % ", ".join(sorted(grp)))
            else:
                if set(declared) != set(grp):
                    add("hreflang-incomplete", disp, "Déclaré : %s ; existant : %s" % (sorted(declared), sorted(grp)))
                if "x-default" not in g.alts:
                    add("hreflang-xdefault", disp, "x-default absent")
                for c, tk in g.alts.items():
                    if not exists(tk):
                        add("hreflang-target-missing", disp, "%s -> %s" % (c, tk))
                    elif tk != k and tk in pages and k not in pages[tk].alts.values():
                        add("hreflang-reciprocal", disp, "%s ne renvoie pas vers cette page" % tk)

    for t, ps in titles.items():
        if len(ps) > 1:
            add("title-dup", ps[0], "Même title sur %d pages : %s" % (len(ps), ", ".join(ps[:4])))
    for t, ps in descs.items():
        if len(ps) > 1:
            add("meta-dup", ps[0], "Même meta sur %d pages : %s" % (len(ps), ", ".join(ps[:4])))

    # robots Disallow vs liens
    for d in disallow:
        dk = d.rstrip("/")
        linked = [k for k, g in pages.items() if any(key(l).startswith(dk) or l.startswith(d) for l in g.links)]
        if linked:
            add("robots-blocks-linked", d, "Disallow %s mais lié depuis %d page(s), ex. %s" % (d, len(linked), linked[0]))

    # CSV
    if args.csv and os.path.isfile(args.csv):
        with open(args.csv, encoding="utf-8-sig") as fh:
            for r in csv.DictReader(fh, delimiter=";"):
                k = key(r["URL"])
                g = pages.get(k)
                if not g:
                    add("csv-page-missing", k, "%s %s" % (r["Page"], r["Langue"]))
                    continue
                bad = []
                if g.title != r["Title"]:
                    bad.append("title « %s » au lieu de « %s »" % (g.title, r["Title"]))
                if g.desc != r["Meta description"]:
                    bad.append("meta différente")
                if bad:
                    add("csv-mismatch", g.path, " ; ".join(bad))

    # redirections
    if src.live:
        for s, dst in (("/fr_be/home-page/", "/"), ("/en/home-page/", "/en/"), ("/case-study/", "/business-cases/"), ("/en/case-study/", "/en/business-cases/")):
            st, h, _ = http(src.base + s, follow=False)
            loc = h.get("Location") or h.get("location") or ""
            if st != 301 or key(loc) != key(dst):
                add("redirect-live", s, "statut %s vers %s (attendu 301 vers %s)" % (st, loc or "-", dst))
    else:
        cands = ["_redirects", "public/_redirects", "netlify.toml", "vercel.json", "astro.config.mjs", "astro.config.ts", ".htaccess", "nginx.conf", "firebase.json", "wrangler.toml"]
        txt = ""
        found = False
        for c in cands:
            for base in (".", args.dist or "."):
                fp = os.path.join(base, c)
                if os.path.isfile(fp):
                    found = True
                    with open(fp, encoding="utf-8", errors="replace") as fh:
                        txt += fh.read()
        if args.redirects_config and os.path.isfile(args.redirects_config):
            found = True
            with open(args.redirects_config, encoding="utf-8", errors="replace") as fh:
                txt += fh.read()
        if not found:
            add("redirect-config-missing", "-", "Aucun fichier de redirections détecté")
        else:
            for s in LEGACY_REDIRECT_SOURCES:
                if s not in txt:
                    add("redirect-missing", s, "Source « %s » introuvable dans la configuration" % s)

    return issues, pages, articles


def report(issues, pages, articles, out, mode):
    order = {"FAIL": 0, "WARN": 1, "INFO": 2}
    issues.sort(key=lambda i: (order[i["severity"]], i["rule"], i["path"]))
    by = defaultdict(list)
    for i in issues:
        by[i["rule"]].append(i)
    n = Counter(i["severity"] for i in issues)
    summary = {"mode": mode, "pages": len(pages), "articles": len(articles), "FAIL": n["FAIL"], "WARN": n["WARN"], "INFO": n["INFO"]}
    with open(out + ".json", "w", encoding="utf-8") as fh:
        json.dump({"summary": summary, "issues": issues}, fh, ensure_ascii=False, indent=1)
    lines = ["# Audit SEO : %s" % mode, "", "%d pages (dont %d articles) : **%d FAIL**, %d WARN, %d INFO" % (len(pages), len(articles), n["FAIL"], n["WARN"], n["INFO"]), ""]
    for rule, items in sorted(by.items(), key=lambda kv: (order[kv[1][0]["severity"]], -len(kv[1]))):
        lines += ["## [%s] %s (%d)" % (items[0]["severity"], rule, len(items)), "", "Correction : " + items[0]["fix"], ""]
        for i in items[:30]:
            lines.append("- `%s` : %s" % (i["path"], i["message"]))
        if len(items) > 30:
            lines.append("- … et %d autres (voir le JSON)" % (len(items) - 30))
        lines.append("")
    with open(out + ".md", "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print("Audit %s : %d pages, %d articles" % (mode, len(pages), len(articles)))
    for rule, items in sorted(by.items(), key=lambda kv: (order[kv[1][0]["severity"]], -len(kv[1]))):
        print("[%-4s] %-24s x%-3d %s" % (items[0]["severity"], rule, len(items), items[0]["message"][:90]))
    print("\nRésumé : %d FAIL, %d WARN, %d INFO -> %s.md / %s.json" % (n["FAIL"], n["WARN"], n["INFO"], out, out))
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--dist", help="dossier du build statique (ex. dist)")
    g.add_argument("--base", help="site en ligne (ex. https://agitech.io)")
    ap.add_argument("--csv", default="seo/titles-metas.csv")
    ap.add_argument("--out", default="seo-report")
    ap.add_argument("--limit", type=int, default=400, help="pages max en mode --base")
    ap.add_argument("--workers", type=int, default=8)
    ap.add_argument("--fail-on", choices=["FAIL", "WARN"], default="FAIL")
    ap.add_argument("--redirects-config", help="fichier de redirections si hors des emplacements usuels")
    a = ap.parse_args()
    if a.dist:
        if not os.path.isdir(a.dist):
            print("Dossier introuvable : %s (lancez d'abord le build)" % a.dist); sys.exit(2)
        src, mode = Dist(a.dist), "build " + a.dist
    else:
        s, _, err = http(a.base.rstrip("/") + "/robots.txt")
        if s == 0:
            print("Impossible de joindre %s (%s)." % (a.base, err)); sys.exit(2)
        src, mode = Live(a.base, a.limit, a.workers), "en ligne " + a.base
    issues, pages, articles = audit(src, a)
    n = report(issues, pages, articles, a.out, mode)
    sys.exit(1 if n["FAIL"] or (a.fail_on == "WARN" and n["WARN"]) else 0)


if __name__ == "__main__":
    main()
