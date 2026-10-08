// Attribution + conversion events for Google Tag Manager. No cookie: the visit's UTM parameters live in
// sessionStorage and are copied into the contact forms so the lead email says where it came from.
(function () {
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  var NAME = 'agitech_attribution';
  var data = {};
  try { data = JSON.parse(sessionStorage.getItem(NAME) || '{}'); } catch (e) {}
  var params = new URLSearchParams(location.search);
  var changed = false;
  KEYS.forEach(function (k) { var v = params.get(k); if (v) { data[k] = v; changed = true; } });
  if (!data.landing_page) {
    data.landing_page = location.pathname;
    if (document.referrer && document.referrer.indexOf(location.host) === -1) data.referrer = document.referrer;
    changed = true;
  }
  if (changed) { try { sessionStorage.setItem(NAME, JSON.stringify(data)); } catch (e) {} }

  document.querySelectorAll('form[action*="formspree.io"]').forEach(function (form) {
    Object.keys(data).forEach(function (k) {
      // The contact form already carries empty utm_* / gclid inputs (as on WordPress): fill those, add the others.
      var input = form.querySelector('input[name="' + k + '"]');
      if (!input) { input = document.createElement('input'); input.type = 'hidden'; input.name = k; form.appendChild(input); }
      input.value = data[k];
    });
  });

  // GTM tag "calendly_booking" listens for this event; it fires for the inline widget and the popup alike.
  window.dataLayer = window.dataLayer || [];
  window.addEventListener('message', function (e) {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') {
      window.dataLayer.push({ event: 'calendly_scheduled' });
    }
  });
})();
