// BEAST FAMILY V3.2 — latest HTML/JSON are network first; only app shell is cached.
const CACHE='beast-family-v3-2-20261025';
const FILES=['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('beast-family-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
 let req=e.request;if(req.method!=='GET')return;let u=new URL(req.url);if(u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/missions.json')){e.respondWith(fetch(req,{cache:'no-store'}));return;}
 if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{if(r.ok){let cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));}return r}).catch(()=>caches.match('./index.html')));return;}
 if(!FILES.some(f=>u.pathname.endsWith(f.slice(2))))return;
 e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>{if(r.ok){let cp=r.clone();caches.open(CACHE).then(ca=>ca.put(req,cp));}return r})));
});
