// service worker ขั้นต่ำ — ให้ติดตั้งเป็นแอปได้ (มือถือ/คอม) · ดึงจากเน็ตก่อน ไม่มีเน็ตค่อยใช้ของที่เก็บไว้
var CACHE = 'kosin-sales-trial-v11';
var SHELL = ['./', './index.html', './config.js', './data.js','./zone.js', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png', './favicon-32.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method!=='GET' || new URL(req.url).origin!==location.origin) return;   // ไม่ยุ่งกับ Apps Script / ภายนอก
  e.respondWith(fetch(req).then(function(res){
    var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); });
    return res;
  }).catch(function(){ return caches.match(req).then(function(r){ return r || caches.match('./index.html'); }); }));
});
