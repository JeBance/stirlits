const cacheName = 'stirlits-v1';

const addResourcesToCache = async (resources) => {
	const cache = await caches.open(cacheName);
	await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/stirlits/",
      "/stirlits/index.html",
      "/stirlits/favicon.ico",
      "/stirlits/assets/js/aes.js",
      "/stirlits/assets/js/script.js",
      "/stirlits/assets/css/style.css",
      "/stirlits/assets/img/icon-32.png",
      "/stirlits/assets/img/icon-64.png",
      "/stirlits/assets/img/icon-128.png",
      "/stirlits/assets/img/icon-180.png",
      "/stirlits/assets/img/icon-192.png",
      "/stirlits/assets/img/icon-196.png",
      "/stirlits/assets/img/icon-256.png",
      "/stirlits/assets/img/icon-512.png",
      "/stirlits/assets/fonts/Old-Soviet.otf",
    ])
  );
});

self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (r) return r;
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		return response;
	})());
});

