const ACACHE = 'dddd-v0.1.0-3eada92-2020-08-31';

// list for app assets
var assets = [
	'./',
	'./app.js',
	'./app.css',
	'./jquery.min.js',
	'./manifest.json',
	'./icon-512x512.png',
	'./icon-384x384.png',
	'./icon-256x256.png',
	'./icon-192x192.png',
];

self.addEventListener('install', function(evt) {
	console.log('[Service Worker] is being installed.', ACACHE);
	//self.skipWaiting();
	evt.waitUntil(caches.open(ACACHE).then(function(cache) {
		return cache.addAll(assets);
	}));
});

self.addEventListener('fetch', async function(evt) {
    var req = evt.request;
    evt.respondWith(assetsFromCache(req));
    //evt.respondWith(fetch(req)); // bypass
});

async function assetsFromCache(req) {
    var cache = await caches.open(ACACHE);
    if (req.url.match(/\/\?.*$/)) { // remove '/?xxxxx...'
        req = './';
    }
    var resp = await cache.match(req) || fetch(req);
    return resp;
}

self.addEventListener('activate', function(ev) {
    const aCache = ACACHE;
    ev.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (aCache != cacheName) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('message', async function(ev) {
    if (ev.data === 'skipWaiting') return self.skipWaiting();
});

