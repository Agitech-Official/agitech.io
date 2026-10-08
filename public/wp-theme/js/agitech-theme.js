/*
 * Port of the WP theme script (wp-content/themes/agitech/library/js/custom.js) for the Astro site.
 * Same behaviour, minus the parts that only exist because of WordPress:
 *   - the admin-ajax loaders for the business-cases and blog tabs (they read the WP-only
 *     `ajax_object` global); filtering is re-implemented on static markup in a later phase.
 * Requires jQuery and Owl Carousel to be loaded first.
 */
jQuery('.navigation .lines-button').on('click', function (e) {
  e.preventDefault();
  $('.navigation').toggleClass('open');
  $(this).toggleClass('active');
});

jQuery(document).ready(function ($) {

  $('#show-social-share').on('click', function (e) {
    e.preventDefault();
    $('#social-share-links').show();
  });

  // Hide when clicking outside
  $(document).on('click', function (e) {
    const $target = $(e.target);

    if (
      !$target.closest('#social-share-links').length &&
      !$target.closest('#show-social-share').length
    ) {
      $('#social-share-links').hide();
    }
  });

  initTabSystem('.we-implemented-section');
  initTabSystem('.our-team-section');
  initTabSystem('.blog-listing-section');

  jQuery('.feedback-section .owl-carousel').owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  });

  $('.we-implemented-section .tab-link, .blog-listing-section .tab-link').on('click', function () {
    $('.tab-link').removeClass('active');
    $(this).addClass('active');
  });

  $('.our-team-section .tab-link').on('click', function () {
    $('.tab-link').removeClass('active');
    $(this).addClass('active');
    const currenttab = $(this).data('tab');
    $('.our-team-section .tab-content .row.items-wrap').hide();

    $('#' + currenttab).show();
  });

  // Prev button
  $('.prev-btn').on('click', function () {
    if ($(this).hasClass('disable')) return;

    const $tabs = $('.tab-link');
    const activeIndex = $tabs.index($('.tab-link.active'));

    if (activeIndex > 0) {
      $tabs.eq(activeIndex - 1).click();
    }
  });

  // Next button
  $('.next-btn').on('click', function () {
    const $tabs = $('.tab-link');
    const activeIndex = $tabs.index($('.tab-link.active'));

    if (activeIndex < $tabs.length - 1) {
      $tabs.eq(activeIndex + 1).click();
    }
  });

  // Init default (all)
  $('.tab-link').first().click();
});

function initTabSystem(sectionSelector) {
  const $section = $(sectionSelector);
  const $tabs = $section.find('.tab-link');
  const $prevBtn = $section.find('.prev-btn');
  const $nextBtn = $section.find('.next-btn');

  function updateTab(index) {
    $tabs.removeClass('active').eq(index).addClass('active');
    $prevBtn.toggleClass('disable', index === 0);
    $nextBtn.toggleClass('disable', index === $tabs.length - 1);
  }

  updateTab(0);

  $tabs.on('click', function () {
    updateTab($tabs.index(this));
  });
}

function isScrolledIntoView($elem) {
  const docViewTop = $(window).scrollTop();
  const docViewBottom = docViewTop + $(window).height();
  const elemTop = $elem.offset().top;
  const elemBottom = elemTop + $elem.height();
  return elemBottom <= docViewBottom && elemTop >= docViewTop;
}

function startCounter() {
  $('.counter:not(.counted)').each(function () {
    const $this = $(this);
    if (isScrolledIntoView($this)) {
      $this.addClass('counted');
      const target = parseInt($this.text(), 10) || 0;

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2000,
          easing: 'swing',
          step: function (now) {
            $this.text(Math.ceil(now));
          }
        }
      );
    }
  });
}

$(window).on('scroll load', function () {
  startCounter();
});

jQuery('.we-implemented-section.owl-carousel-wrap .owl-carousel').owlCarousel({
  loop: true,
  margin: 0,
  nav: false,
  dots: false,
  autoplay: false,
  autoplayTimeout: 3000,
  responsive: {
    0: { items: 1 },
    576: { items: 1 },
    768: { items: 2 },
    992: {
      items: 3,
      autoplay: true,
    },
    1200: { items: 4 }
  }
});

// team slider
jQuery(document).ready(function ($) {

  var $slider = $('.certified-experts-section .experts-slider');

  $slider.owlCarousel({
    loop: true,
    margin: 32,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplaySpeed: 5000,
    smartSpeed: 600,
    slideTransition: 'linear',
    autoplayHoverPause: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    freeDrag: false,
    rtl: false,
    responsive: {
      0: { items: 1.3, margin: 16 },
      768: { items: 2.3, margin: 20 },
      992: { items: 3.2 },
      1200: { items: 4.2, margin: 32 },
      1400: { items: 4.2 }
    }
  });

  $slider.on('drag.owl.carousel', function () {
    $slider.trigger('stop.owl.autoplay');
  });

  $slider.on('dragged.owl.carousel', function () {
    $slider.trigger('play.owl.autoplay');
  });

});

jQuery(document).ready(function ($) {

  // header submenu (mobile)
  $('.header-wrap .navigation .main_menu .menu > li.menu-item-has-children .dropdown-arrow').on('click', function (e) {
    if ($(window).width() <= 1199) {

      e.preventDefault();
      e.stopPropagation();

      var $parentLi = $(this).closest('li.menu-item-has-children');

      $('.header-wrap .navigation .main_menu .menu > li.menu-item-has-children').not($parentLi).removeClass('active');

      $parentLi.toggleClass('active');
    }
  });

  $('a[href^="#"]').on('click', function (event) {
    if (this.hash !== '') {
      event.preventDefault();
      var target = this.hash;
      var $target = $(target);

      if ($target.length) {
        var headerHeight = $('header').outerHeight();
        var targetPosition = $target.offset().top - headerHeight;

        $('html, body').animate({
          scrollTop: targetPosition
        }, 200);
      }
    }
  });

  // header height
  function setHeaderHeight() {
    const header = document.querySelector('header');
    if (!header) return;

    const height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', height + 'px');
  }

  // Also run right away: jQuery 3 defers ready callbacks, so on a fast/cached page the window
  // "load" event can already have fired and the mobile menu would be laid out without the var.
  setHeaderHeight();
  window.addEventListener('load', setHeaderHeight);
  window.addEventListener('resize', setHeaderHeight);

});

// Calendly popup links (WP link type "calendly_popup"): load Calendly's CSS/JS on first click, then open the popup.
var calendlyReady = null;
function loadCalendly() {
  if (calendlyReady) return calendlyReady;
  calendlyReady = new Promise(function (resolve, reject) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
  return calendlyReady;
}
jQuery(document).on('click', 'a[data-calendly-url]', function (e) {
  e.preventDefault();
  var url = this.getAttribute('data-calendly-url');
  var p = new URLSearchParams(window.location.search);
  loadCalendly().then(function () {
    window.Calendly.initPopupWidget({
      url: url,
      utm: { utmSource: p.get('utm_source'), utmMedium: p.get('utm_medium'), utmCampaign: p.get('utm_campaign') }
    });
  }).catch(function () { window.open(url, '_blank', 'noopener'); });
});

// Static listings (blog, business cases): replaces the WP admin-ajax loaders. Every card is already
// in the page; the category/type tabs filter them and "load more" reveals 8 more at a time.
jQuery(function ($) {
  $('[data-listing]').each(function () {
    var $section = $(this);
    var perPage = 8;
    var shown = perPage;
    var category = 'all';
    var $cards = $section.find('.items-wrap > .field');
    var $more = $section.find('.load-more-wrapper');

    function render() {
      var $matches = $cards.filter(function () {
        if (category === 'all') return true;
        return (($(this).attr('data-categories') || '').split(' ').indexOf(category) > -1);
      });
      $cards.hide();
      $matches.slice(0, shown).show();
      $more.toggle($matches.length > shown);
    }

    $section.find('.tab-link').on('click', function () {
      category = $(this).attr('data-category') || 'all';
      shown = perPage;
      render();
    });
    $section.find('.load-more-btn a').on('click', function (e) {
      e.preventDefault();
      shown += perPage;
      render();
    });
    render();
  });
});
