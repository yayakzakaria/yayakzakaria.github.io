importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: "/index.html", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/team.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/images/logo.png", revision: "1" },
  { url: "/images/logo_maskable.png", revision: "1" },
  { url: "/images/logo_256.png", revision: "1" },
  { url: "/images/logo_256_maskable.png", revision: "1" },
  { url: "/images/logo_128.png", revision: "1" },
  { url: "/images/logo_128_maskable.png", revision: "1" },
  { url: "/images/logo_ios.png", revision: "1" },
  { url: "/pages/home.html", revision: "1" },
  { url: "/pages/2014.html", revision: "1" },
  { url: "/pages/2015.html", revision: "1" },
  { url: "/pages/2021.html", revision: "1" },
  { url: "/pages/saved.html", revision: "1" },
  { url: "/css/materialize.min.css", revision: "1" },
  { url: "/css/style.css", revision: "1" },
  { url: "/js/materialize.min.js", revision: "1" },
  { url: "/js/sw-register.js", revision: "1" },
  { url: "/js/sw-team.js", revision: "1" },
  { url: "/js/nav.js", revision: "1" },
  { url: "/js/api.js", revision: "1" },
  { url: "/js/idb.js", revision: "1" },
  { url: "/js/db.js", revision: "1" },
], {
  ignoreUrlParametersMatching: [/.*/]
});

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/crests\.football-data\.org\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-logo',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  
  var options = {
    body: body,
    icon: 'images/logo.png',
    badge: 'images/logo_128.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('FootBall Info', options)
  );
});