const CACHE_NAME = "torresapp-cache-v1";
const URLS_TO_CACHE = ["/", "/index.html", "/index.tsx"];

// Instala o Service Worker e armazena os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Intercepta as requisições e serve os arquivos do cache se estiverem disponíveis
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se o arquivo estiver no cache, retorna ele
      if (response) {
        return response;
      }
      // Senão, faz a requisição na rede
      return fetch(event.request);
    })
  );
});

// Remove caches antigos quando um novo Service Worker é ativado
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
