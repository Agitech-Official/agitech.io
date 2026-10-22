#!/usr/bin/env python3
"""Contrôle post-déploiement de agitech.io (stdlib uniquement).

Usage : python3 check_seo.py [--base https://agitech.io] [--csv titles-metas.csv]
Code de sortie 1 s'il y a au moins un ECHEC.
"""
import argparse, csv, html, json, re, sys, urllib.request, urllib.error, urllib.parse

UA = {"User-Agent": "Mozilla/5.0 (compatible; agitech-seo-check/1.0)"}
ok_n = warn_n = fail_n = 0


def log(level, msg):
    global ok_n, warn_n, fail_n
    if level == "OK": ok_n += 1
    elif level == "WARN": warn_n += 1
    else: fail_n += 1
    print(f"[{level:5}] {msg}")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def fetch(url, follow=True):
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers=UA)
    try:
        r = opener.open(req, timeout=25)
        return r.status, dict(r.headers), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), ""
    except Exception as e:
        return 0, {}, str(e)


def head_info(body):
    t = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]*?content=(["\'])(.*?)\1', body, re.S | re.I) \
        or re.search(r'<meta[^>]+content=(["\'])(.*?)\1[^>]+name=["\']description["\']', body, re.S | re.I)
    c = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', body, re.I)
    ld = re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', body, re.S | re.I)
    return (html.unescape(t.group(1).strip()) if t else "",
            html.unescape(m.group(2).strip()) if m else "",
            c.group(1) if c else "", ld)


def types_of(node):
    out = []
    if isinstance(node, dict):
        t = node.get("@type")
        out += t if isinstance(t, list) else ([t] if t else [])
        for v in node.values(): out += types_of(v)
    elif isinstance(node, list):
        for v in node: out += types_of(v)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://agitech.io")
    ap.add_argument("--csv", default="titles-metas.csv")
    a = ap.parse_args()
    base = a.base.rstrip("/")

    s, _, err = fetch(base + "/robots.txt")
    if s == 0:
        print(f"Impossible de joindre {base} ({err}). Vérifiez la connexion ou le proxy, puis relancez.")
        sys.exit(2)

    print("== 1. Ancien WordPress encore servi ==")
    for p in ["/", "/odoo-erp/", "/blog/", "/business-cases/", "/implementation-odoo-pme-bruxelles/",
              "/en/", "/en/blog/", "/nl/"]:
        s, _, b = fetch(base + p)
        if s != 200: log("FAIL", f"{p} -> HTTP {s}")
        elif "wp-content" in b or "Site Kit by Google" in b: log("FAIL", f"{p} sert encore l'ancien WordPress")
        else: log("OK", f"{p} nouveau site")

    print("\n== 2. Redirections 301 ==")
    for src, dst in [("/fr_be/home-page/", "/"), ("/en/home-page/", "/en/"),
                     ("/case-study/", "/business-cases/"), ("/en/case-study/", "/en/business-cases/"),
                     ("/fr_be/gouvernance-de-projet-qui-decide-quoi-dans-un-projet-odoo/",
                      "/gouvernance-de-projet-qui-decide-quoi-dans-un-projet-odoo/")]:
        s, h, _ = fetch(base + src, follow=False)
        loc = h.get("Location") or h.get("location") or ""
        path = urllib.parse.urlparse(loc).path or loc
        if s != 301: log("FAIL", f"{src} -> {s} (attendu 301)")
        elif path != dst: log("FAIL", f"{src} -> {loc} (attendu {dst})")
        else:
            s2, _, _ = fetch(base + dst, follow=False)
            log("OK" if s2 == 200 else "FAIL", f"{src} -> 301 -> {dst} ({s2})")

    print("\n== 3. Titles et metas vs CSV ==")
    try:
        rows = list(csv.DictReader(open(a.csv, encoding="utf-8-sig"), delimiter=";"))
    except FileNotFoundError:
        rows = []; log("WARN", f"CSV introuvable : {a.csv}")
    for r in rows:
        url = base + urllib.parse.urlparse(r["URL"]).path
        s, _, b = fetch(url)
        if s != 200: log("FAIL", f"{r['Page']} {r['Langue']} {url} -> HTTP {s}"); continue
        t, m, c, _ = head_info(b)
        bad = []
        if t != r["Title"]: bad.append(f"title='{t}'")
        if m != r["Meta description"]: bad.append("meta différente")
        if c and urllib.parse.urlparse(c).path != urllib.parse.urlparse(url).path: bad.append(f"canonical={c}")
        if not c: bad.append("canonical absente")
        log("FAIL" if bad else "OK", f"{r['Page']} {r['Langue']} {' ; '.join(bad)}")

    print("\n== 4. JSON-LD ==")
    need = {"/": {"Organization", "WebSite"}, "/en/": {"Organization", "WebSite", "FAQPage"},
            "/implementation-odoo-pme-bruxelles/": {"Article"},
            "/guide-choix-partenaire-odoo-pme/": {"Article"}}
    for p, want in need.items():
        s, _, b = fetch(base + p)
        _, _, _, ld = head_info(b)
        found = set()
        bad = False
        for blk in ld:
            try: found |= set(types_of(json.loads(blk)))
            except Exception: bad = True
        if bad: log("FAIL", f"{p} JSON-LD invalide")
        elif want - found: log("FAIL", f"{p} types manquants : {sorted(want - found)}")
        else: log("OK", f"{p} {sorted(found)}")

    print("\n== 5. robots.txt et sitemap ==")
    s, _, rb = fetch(base + "/robots.txt")
    log("OK" if "Sitemap:" in rb else "FAIL", "robots.txt déclare un sitemap")
    for line in rb.splitlines():
        if line.lower().startswith("disallow: /simulateur"):
            log("WARN", "/simulateur/ est en Disallow alors qu'il est lié depuis la FAQ")
    s, _, sm = fetch(base + "/sitemap-0.xml")
    if s != 200: log("FAIL", f"sitemap-0.xml -> HTTP {s}")
    else:
        log("OK" if "<lastmod>" in sm else "WARN", "sitemap : lastmod présent")
        log("FAIL" if "/case-study/" in sm else "OK", "sitemap : plus d'URL /case-study/")
        log("FAIL" if "/fr_be/" in sm else "OK", "sitemap : plus d'URL /fr_be/")
        log("OK" if 'hreflang="x-default"' in sm else "WARN", "sitemap : x-default déclaré")

    print(f"\nRésumé : {ok_n} OK, {warn_n} avertissements, {fail_n} échecs")
    sys.exit(1 if fail_n else 0)


if __name__ == "__main__":
    main()
