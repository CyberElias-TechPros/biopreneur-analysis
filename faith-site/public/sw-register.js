/*
  Register the service worker after the page is idle, so it never competes with
  the LCP image or the fonts. Registration failure is silent: offline reading is
  a bonus, never a requirement.
*/
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;

  window.addEventListener('load', function () {
    var start = function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(start, { timeout: 4000 });
    } else {
      window.setTimeout(start, 2500);
    }
  });
})();
