const CACHE = "cronograma-v5";

const FILES = [
"index.html",
"cronograma.html",
"manifest.json",
"icon.png"
];

self.addEventListener("install",e=>{
self.skipWaiting();
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
});

self.addEventListener("activate",e=>{
e.waitUntil(
caches.keys().then(keys=>
Promise.all(keys.map(k=>k!==CACHE && caches.delete(k)))
));
self.clients.claim();
});

self.addEventListener("fetch",e=>{

const url=e.request.url;

if(url.includes("firebaseio")||url.includes("googleapis")){
return;
}

e.respondWith(
fetch(e.request)
.then(r=>{
let copy=r.clone();
caches.open(CACHE).then(c=>c.put(e.request,copy));
return r;
})
.catch(()=>caches.match(e.request))
);

});
