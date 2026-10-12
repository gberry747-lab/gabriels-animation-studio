// Offline support for Gabriel's Animation Studio.
// Online: always fetch the newest game files (so GitHub Pages updates still arrive), and refresh the cache.
// Offline or slow network: play from the cached copy.
// Bump VERSION only when the list of app files below changes.
const VERSION = 'gas-v2';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './vendor/matter.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function fresh(req, key, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('slow')), ms);
    fetch(req).then(res => {
      clearTimeout(timer);
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
      resolve(res);
    }, err => { clearTimeout(timer); reject(err); });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Leaderboards, sign-in and online VS go straight to the network; the game already handles being offline.
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fresh(req, './index.html', 4000).catch(() => caches.match('./index.html', {ignoreSearch: true})));
    return;
  }
  // Network first for every game file too, so index.html and the files it loads always come from the same version.
  e.respondWith(fresh(req, req, 4000).catch(() => caches.match(req, {ignoreSearch: true})));
});
