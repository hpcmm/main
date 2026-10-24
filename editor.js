(async function(){
'use strict';
await window.HPCMM_CONTENT_READY;if(!window.HPCMM_CONTENT)return;
const orcid=window.HPCMM_ORCID;
let draft=orcid.migrate(structuredClone(window.HPCMM_CONTENT)), dirty=false, active='group';
const form=document.getElementById('editor-form'),status=document.getElementById('status');
const sections={group:'Group information',images:'Cover & group photos',research:'Research areas',publications:'Publications',members:'Group members',software:'Software',news:'News',contact:'Contact'};
const labels={cienciavitae:'CIÊNCIAVITAE profile URL (optional)',researchgate:'ResearchGate profile URL (optional)',linkedin:'LinkedIn profile URL (optional)',website:'Personal website URL (optional)',publicationDate:'Publication date (YYYY, YYYY-MM or YYYY-MM-DD)',orcid:'ORCID iD or profile link',autoSync:'Automatically add new public works in weekly updates',shortName:'Short name',name:'Name',tagline:'Homepage introduction',intro:'About: opening paragraph',about:'About: description',note:'Draft note (leave empty to hide)',src:'Image',alt:'Image description for accessibility',caption:'Caption / credit',title:'Title',description:'Description',details:'Details',placeholder:'This is example content (show a placeholder label)',id:'Permanent identifier',authors:'Authors and journal',year:'Year',topic:'Topic',abstract:'Abstract',url:'Publication or repository link',role:'Role',biography:'Biography',interests:'Research interests',paperIds:'Member publications',date:'Date',text:'News text',institution:'Institution / department',location:'City, country',email:'Contact email'};
const templates={research:{title:'New research area',description:'',details:'',placeholder:true},publications:{id:'',title:'New publication',authors:'',year:'',publicationDate:'',topic:'',abstract:'',url:'',placeholder:true},members:{id:'',orcid:'',autoSync:false,name:'New member',role:'',cienciavitae:'',researchgate:'',linkedin:'',website:'',email:'',biography:'',interests:'',paperIds:[],placeholder:true},software:{title:'New software',description:'',url:'',placeholder:true},news:{date:'',title:'New update',text:'',placeholder:true}};
function changed(){dirty=true;status.textContent='Draft changed. Preview or download when ready.';}
function el(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;}
function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;}
function validate(data){
 if(new Blob([JSON.stringify(data)]).size>24*1024*1024)throw Error('The content file is over 24 MB. Resize the photos before uploading them.');
 orcid.migrate(data);
 for(const m of data.members){if(m.orcid)m.orcid=orcid.normalize(m.orcid);if(m.autoSync&&!m.orcid)throw Error('Enter an ORCID iD before enabling automatic updates.');if(!Array.isArray(m.orcidExcluded)||m.orcidExcluded.some(k=>typeof k!=='string'))throw Error('Invalid ORCID exclusions.');}
 if(!data||data.schemaVersion!==1)throw Error('This file is not a supported website content file.');
 for(const k of Object.keys(sections)){if(!data[k]||typeof data[k]!=='object')throw Error('Missing section: '+k);}
 for(const k of ['group','contact'])for(const field of Object.keys(window.HPCMM_CONTENT[k]))if(typeof data[k][field]!=='string')throw Error('Invalid '+k+' field: '+field);
 for(const key of Object.keys(templates)){
  if(!Array.isArray(data[key]))throw Error('Invalid section: '+key);
  for(const item of data[key])for(const [field,value] of Object.entries(templates[key])){
   if(Array.isArray(value)){if(!Array.isArray(item[field])||item[field].some(v=>typeof v!=='string'))throw Error('Invalid member publications.');}
   else if(typeof item[field]!==typeof value)throw Error('Invalid '+key+' field: '+field);
  }
 }
 for(const key of ['members','publications']){const ids=data[key].map(x=>x.id);if(ids.some(id=>!/^[a-z0-9][a-z0-9-]*$/.test(id))||new Set(ids).size!==ids.length)throw Error('Each '+key+' identifier must be unique, with lowercase letters, numbers and hyphens only.');}
 for(const key of ['cover','groupPhoto']){const im=data.images[key];if(!im||['src','alt','caption'].some(k=>typeof im[k]!=='string'))throw Error('Invalid image settings.');if(im.src&&!im.alt.trim())throw Error('Add an accessibility description for the '+(key==='cover'?'cover image':'group photo')+'.');if(im.src&&!/^(data:image\/(png|jpeg|webp);base64,|https?:\/\/|[\w./-]+\.(png|jpe?g|webp)$)/i.test(im.src))throw Error('Unsupported image format.');}
 for(const m of data.members){for(const key of ['cienciavitae','researchgate','linkedin','website'])if(m[key]&&!/^https?:\/\/[^\s]+$/i.test(m[key]))throw Error('Profile links must start with https:// or http://.');if(m.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email))throw Error('Enter a valid member email or leave it empty.');if(!m.photo||['src','alt','caption'].some(k=>typeof m.photo[k]!=='string'))throw Error('Invalid member photo.');if(m.photo.src&&!m.photo.alt.trim())throw Error('Add a description for '+m.name+'’s photograph.');if(m.photo.src&&!/^(data:image\/(png|jpeg|webp);base64,|https?:\/\/|[\w./-]+\.(png|jpe?g|webp)$)/i.test(m.photo.src))throw Error('Unsupported member image format.');}
 for(const paper of data.publications)if(paper.publicationDate&&!window.HPCMM_PUBLICATIONS.validDate(paper.publicationDate))throw Error('Enter a valid publication date (YYYY, YYYY-MM or YYYY-MM-DD), or leave it empty.');
 // Discard dangling associations left by older content files; keep every existing paper.
 const publicationIds=new Set(data.publications.map(p=>p.id));
 for(const m of data.members)m.paperIds=m.paperIds.filter(id=>publicationIds.has(id));
 for(const x of [...data.publications,...data.software])if(x.url&&!/^https?:\/\/\S+$/i.test(x.url))throw Error('Links must start with https:// or http://.');
 if(data.contact.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email))throw Error('Please enter a valid contact email or leave it empty.');
}
function field(obj,key){
 const label=el('label',undefined,'edit-field');label.append(el('span',labels[key]||key));
 if(key==='paperIds'){
  const box=el('fieldset',undefined,'paper-choices');box.append(el('legend','Publications belonging to this member'));
  if(!draft.publications.length)box.append(el('p','Add publications in the Publications section first.'));
  for(const p of draft.publications){const row=el('label');const input=el('input');input.type='checkbox';input.checked=obj.paperIds.includes(p.id);input.addEventListener('change',()=>{obj.paperIds=input.checked?[...obj.paperIds,p.id]:obj.paperIds.filter(id=>id!==p.id);if(input.checked)orcid.include(obj,p);else orcid.exclude(obj,p);changed();});row.append(input,el('span',p.title));box.append(row);}return box;
 }
 const bool=typeof obj[key]==='boolean';const multiline=['tagline','intro','about','description','details','abstract','biography','interests','text'].includes(key);const input=el(multiline?'textarea':'input');
 if(bool){label.classList.add('check');input.type='checkbox';input.checked=obj[key];}
 else{input.value=obj[key];if(key==='id'){input.readOnly=true;label.append(el('small','Assigned automatically. Kept stable so profile links and publication selections continue to work.'));}}
 input.addEventListener('input',()=>{obj[key]=bool?input.checked:input.value;changed();});label.append(input);return label;
}

function orcidImport(member){
 const panel=el('div',undefined,'orcid-panel');const message=el('p','Import public works, review them, then add the papers you want. ORCID names and biographies are not imported.');message.setAttribute('role','status');
 const review=el('div');const load=button('Import publications from ORCID',async()=>{
  load.disabled=true;review.replaceChildren();message.textContent='Reading public works from ORCID…';
  try{const id=orcid.normalize(member.orcid);const items=await orcid.list(id);member.orcid=id;
   if(!items.length){message.textContent='No public works are listed on this ORCID record. Check the record’s visibility settings.';return;}
   message.textContent=items.length+' public works found. Unchecked works will stay excluded from automatic updates.';
   const choices=items.map(c=>{const label=el('label',undefined,'orcid-choice'),checkbox=el('input');checkbox.type='checkbox';checkbox.checked=!(member.orcidExcluded||[]).includes(c.key);label.append(checkbox,el('span',c.title+(c.year?' ('+c.year+')':'')));review.append(label);return {c,checkbox};});
   const apply=button('Add selected publications',async()=>{
    apply.disabled=true;load.disabled=true;let warnings=0,added=0;
    try{const selected=[];for(const {c,checkbox} of choices){if(checkbox.checked){let item=c;if(!orcid.find(draft,c)){try{item=await orcid.details(c);}catch{warnings++;}}selected.push(item);}}
     for(const {c,checkbox} of choices){if(checkbox.checked)member.orcidExcluded=(member.orcidExcluded||[]).filter(k=>k!==c.key);else{member.orcidExcluded=Array.from(new Set([...(member.orcidExcluded||[]),c.key]));const existing=orcid.find(draft,c);if(existing)member.paperIds=member.paperIds.filter(id=>id!==existing.id);}}
     for(const c of selected)if(orcid.attach(draft,member,c).added)added++;
     member.autoSync=true;
     changed();render();status.textContent=selected.length+' papers linked to this member; '+added+' new entries added.'+(warnings?' Some author details were unavailable; review those citations.':'')+' Download content.js to save these changes.';
    }catch(e){message.textContent=e.message;}finally{apply.disabled=false;load.disabled=false;}
   },'primary');review.append(apply);
  }catch(e){message.textContent=e.message;}finally{load.disabled=false;}
 });
 panel.append(load,message,review,el('small','Weekly updates run only after the supplied GitHub workflow is installed and enabled. They add new works, keep your edits, and respect unchecked papers.'));return panel;
}

function photoEditor(key,title,memberPhoto){
 const obj=memberPhoto||draft.images[key],card=el('section',undefined,'edit-card');card.append(el('h3',title));
 const label=el('label',undefined,'edit-field');label.append(el('span','Choose an image (PNG, JPG or WebP; up to 5 MB)'));const input=el('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';label.append(input);card.append(label);
 input.addEventListener('change',async()=>{const f=input.files[0];if(!f)return;if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>5*1024*1024){status.textContent='Choose a PNG, JPG or WebP image smaller than 5 MB.';return;}try{const reader=new FileReader();const result=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(f);});const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=result;});obj.src=result;changed();render();}catch{status.textContent='That file could not be read as an image.';}});
 if(obj.src){const img=el('img');img.src=obj.src;img.alt=obj.alt||'Selected photo preview';img.className='photo-preview';card.append(img,button('Remove image',()=>{obj.src='';changed();render();},'remove'));}
 else card.append(el('p',memberPhoto?'No portrait selected. This member will use a text-only layout.':'No image selected. The website will show a placeholder.'));
 card.append(field(obj,'alt'),field(obj,'caption'));return card;
}
function render(){
 form.replaceChildren(el('h2',sections[active]));if(active==='publications')form.append(el('p','The homepage automatically shows the five most recent group publications. Enter dates for accurate ordering; older publications remain on member profiles.')); document.querySelectorAll('#sections button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.section===active)));
 if(active==='images'){form.append(photoEditor('cover','Cover research image'),photoEditor('groupPhoto','Group photograph'));return;}
 const data=draft[active];
 if(!Array.isArray(data)){for(const key of Object.keys(data))form.append(field(data,key));return;}
 data.forEach((item,index)=>{const card=el('section',undefined,'edit-card');card.append(el('h3',(index+1)+'. '+(item.name||item.title)));if(active==='members')card.append(photoEditor(null,'Member photograph (optional)',item.photo));for(const key of Object.keys(templates[active])){card.append(field(item,key));if(active==='members'&&key==='orcid')card.append(orcidImport(item));}card.append(button('Remove this entry',()=>{if(!confirm('Remove this entry from the draft?'))return;const removed=data.splice(index,1)[0];if(active==='publications')draft.members.forEach(m=>{orcid.exclude(m,removed);m.paperIds=m.paperIds.filter(id=>id!==removed.id);});changed();render();},'remove'));form.append(card);});
 form.append(button('Add '+({members:'member',publications:'publication',research:'research area',software:'software',news:'news item'}[active]),()=>{const item=structuredClone(templates[active]);if(active==='members'){item.orcidExcluded=[];item.photo={src:'',alt:'',caption:''};}if('id'in item)item.id=(active==='members'?'member-':'paper-')+crypto.randomUUID().slice(0,8);data.push(item);changed();render();},'primary'));
}
for(const [key,title]of Object.entries(sections)){const b=button(title,()=>{active=key;render();});b.dataset.section=key;document.getElementById('sections').append(b);}
form.addEventListener('submit',e=>e.preventDefault());
document.getElementById('download').addEventListener('click',()=>{try{validate(draft);const serialized='// Generated by editor.html. Upload this file alongside index.html.\nwindow.HPCMM_CONTENT = '+JSON.stringify(draft,null,2)+';\n';const url=URL.createObjectURL(new Blob([serialized],{type:'text/javascript'}));const a=el('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;status.textContent='Download prepared. Upload content.js to GitHub to publish; the live site has not changed yet.';}catch(e){status.textContent=e.message;}});
document.getElementById('import').addEventListener('change',async event=>{const f=event.target.files[0];if(!f)return;try{if(f.size>24*1024*1024)throw Error('This content file is too large.');let text=await f.text();if(text.includes('window.HPCMM_CONTENT = '))text=text.slice(text.indexOf('window.HPCMM_CONTENT = ')+23).trim().replace(/;\s*$/,'');const data=JSON.parse(text);validate(data);if(dirty&&!confirm('Replace the current unsaved draft with this file?'))return;draft=data;changed();render();status.textContent='Saved content loaded. Preview or edit it before downloading.';}catch(e){status.textContent='Could not load content: '+e.message;}event.target.value='';});
const dialog=document.getElementById('preview-dialog');
document.getElementById('preview').addEventListener('click',()=>{try{validate(draft);const json=JSON.stringify(draft).replace(/</g,'\\u003c');document.getElementById('draft-frame').srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="styles.css?v=20261024-3"></head><body data-page="home"><div class="prototype"></div><header><div class="nav-wrap"><a class="brand" href="index.html">HPC-MM</a></div></header><main id="main"></main><footer></footer><script>window.HPCMM_CONTENT='+json+';<\/script><script src="publication-order.js?v=20261024-3"><\/script><script src="site.js?v=20261024-3"><\/script><script src="script.js"><\/script></body></html>';dialog.showModal();}catch(e){status.textContent=e.message;}});
document.getElementById('close-preview').addEventListener('click',()=>dialog.close());
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
render();
})();
