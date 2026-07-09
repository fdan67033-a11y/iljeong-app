/* 일정 PWA 서비스워커 — 앱 껍데기 오프라인 캐시 (데이터는 캐시 안 함) */
var C = 'iljeong-app-v1';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(C).then(function(c){ return c.addAll(SHELL); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if(k!==C) return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if(u.origin !== location.origin) return;          // GitHub API 등 외부는 그대로 통과(캐시 안 함)
  e.respondWith(
    fetch(e.request).then(function(r){                // 앱 파일은 네트워크 우선, 최신 유지
      var cp = r.clone(); caches.open(C).then(function(c){ c.put(e.request, cp); });
      return r;
    }).catch(function(){ return caches.match(e.request); })  // 오프라인이면 캐시
  );
});
