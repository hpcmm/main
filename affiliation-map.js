(() => {
const fields = text => String(text || '').split('\n').map(line=>line.split('|').map(s=>s.trim()));
const key = s=>s.toLowerCase().replace(/\s+/g,' ').trim();
function groups(d){
 const locations=new Map();
 for(const [name,lat,lon] of fields(d.group.affiliationLocations)){
  if(!name||!lat||!lon||!Number.isFinite(+lat)||!Number.isFinite(+lon)||Math.abs(+lat)>90||Math.abs(+lon)>180)continue;
  locations.set(key(name),{name,lat:+lat,lon:+lon,people:new Set()});
 }
 for(const [name,aff] of [...d.members.map(m=>[m.name,m.affiliation]),...fields(d.group.formerMembers),...fields(d.group.collaborators)]){
  if(name&&aff)locations.get(key(aff))?.people.add(name);
 }
 return [...locations.values()].filter(p=>p.people.size);
}
window.HPCMM_AFFILIATION_GROUPS=groups;
window.HPCMM_AFFILIATION_MAP=(target,d)=>{
 if(!target)return;
 const places=groups(d);
 const svgNS='http://www.w3.org/2000/svg';
 const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node;};
 const svg=(tag,attrs)=>{const node=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);return node;};
 const stage=el('div');stage.className='map-stage';
 const ocean=svg('svg',{viewBox:'0 0 500 300',role:'img','aria-label':'Map of institutional affiliations'});
 const geo=window.HPCMM_MAP_LAND||'';
 const lons=places.map(p=>p.lon),lats=places.map(p=>p.lat);
 const middleX=places.length?(Math.max(...lons)+Math.min(...lons))/2:0;
 const middleY=places.length?(Math.max(...lats)+Math.min(...lats))/2:15;
 const span=Math.min(360,Math.max(55,...(places.length?[(Math.max(...lons)-Math.min(...lons))*1.24,(Math.max(...lats)-Math.min(...lats))*2.15]:[360])));
 const left=Math.max(-180,Math.min(180-span,middleX-span/2)),height=span*.6;
 const top=Math.max(-90,Math.min(90-height,-middleY-height/2)),scale=500/span;
 ocean.append(svg('path',{class:'map-land',d:geo,transform:`scale(${scale}) translate(${-left} ${-top})`}));
 stage.append(ocean);target.append(stage);
 const info=el('div');info.className='map-info';info.setAttribute('aria-live','polite');
 const controls=[];
 function select(place){
  controls.forEach(([button,p])=>button.setAttribute('aria-pressed',String(p===place)));
  const names=el('ul');[...place.people].sort((a,b)=>a.localeCompare(b)).forEach(name=>names.append(el('li',name)));
  info.replaceChildren(el('strong',place.name),names);
 }
 for(const place of places){
  const button=el('button',String(place.people.size));button.type='button';button.className='map-pin';
  button.setAttribute('aria-label',place.name);button.setAttribute('aria-pressed','false');
  button.style.left=((place.lon-left)/span*100)+'%';button.style.top=((-place.lat-top)/height*100)+'%';
  controls.push([button,place]);button.addEventListener('click',()=>select(place));stage.append(button);
 }
 target.append(info);
 if(places.length)select(places[0]);
 else info.append(el('p','Institution locations will appear here when added.'));
};
})();
