(() => {
const split = text => String(text || '').split('\n').map(line => line.split('|').map(field => field.trim()));
const key = text => text.toLowerCase().replace(/\s+/g,' ').trim();
let leaflet;
function loadMapLibrary(){
 if(window.L?.map) return Promise.resolve(window.L);
 if(leaflet) return leaflet;
 leaflet=new Promise((resolve,reject)=>{
  const css=document.createElement('link');
  css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.append(css);
  const script=document.createElement('script');
  script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload=()=>window.L?.map?resolve(window.L):reject();
  script.onerror=reject;document.head.append(script);
 });
 return leaflet;
}
function groups(d){
 const locations=new Map();
 for(const [name,lat,lon] of split(d.group.affiliationLocations)){
  if(!name || !lat || !lon || !Number.isFinite(+lat) || !Number.isFinite(+lon) || Math.abs(+lat)>85 || Math.abs(+lon)>180)continue;
  locations.set(key(name),{name,coords:[+lat,+lon],people:new Set()});
 }
 const people=[...d.members.map(m=>[m.name,m.affiliation]),...split(d.group.formerMembers),...split(d.group.collaborators)];
 for(const [name,aff] of people)if(name&&aff)locations.get(key(aff))?.people.add(name);
 return [...locations.values()].filter(place=>place.people.size);
}
window.HPCMM_AFFILIATION_GROUPS=groups;
window.HPCMM_AFFILIATION_MAP=(target,d)=>{
 if(!target)return;
 const places=groups(d);
 const make=(tag,label)=>{const el=document.createElement(tag);if(label)el.textContent=label;return el;};
 if(!places.length){target.append(make('p','No institutional locations have been added yet.'));return;}
 const details=make('details'),summary=make('summary','Open affiliation map'),canvas=make('div'),status=make('p');
 canvas.className='campus-map';canvas.setAttribute('aria-label','Map of institutional affiliations');canvas.hidden=true;
 status.setAttribute('role','status');details.append(summary,status,canvas);
 let started=false,map;
 details.addEventListener('toggle',async()=>{
  if(!details.open)return;
  if(map){map.invalidateSize();return;}
  if(started)return;
  started=true;status.textContent='Loading map…';
  try{
   const L=await loadMapLibrary();canvas.hidden=false;
   map=L.map(canvas,{scrollWheelZoom:false});
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
   for(const place of places){
    const popup=make('div'),names=make('ul');popup.append(make('strong',place.name),names);
    [...place.people].sort().forEach(name=>names.append(make('li',name)));
    const marker=L.marker(place.coords,{title:place.name,alt:place.name,icon:L.divIcon({className:'campus-pin',html:String(place.people.size),iconSize:[30,30]})}).addTo(map);
    marker.bindPopup(popup);
   }
   if(places.length===1)map.setView(places[0].coords,12);
   else map.fitBounds(places.map(place=>place.coords),{padding:[24,24],maxZoom:12});
   status.textContent='';
  }catch{canvas.hidden=true;status.textContent='The map could not load. The institution list is below.';}
 });
 const list=make('ul');
 for(const place of places){const item=make('li');item.append(make('strong',place.name),document.createTextNode(' — '+[...place.people].sort().join(', ')));list.append(item);}
 target.append(details,list);
};
})();
