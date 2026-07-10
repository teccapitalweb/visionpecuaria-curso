const CACHE_NAME = 'vision-pecuaria-curso-v1';
const ARCHIVOS_CACHE = [
  './curso.html',
  './recetario.pdf',
  './calculadora.xlsx',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(nombres){
      return Promise.all(
        nombres.filter(function(nombre){ return nombre !== CACHE_NAME; })
               .map(function(nombre){ return caches.delete(nombre); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  // Los videos siguen viniendo de Google Drive (network-only), todo lo demás cache-first
  if(event.request.url.indexOf('drive.google.com') !== -1){
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(respuesta){
      return respuesta || fetch(event.request);
    })
  );
});
