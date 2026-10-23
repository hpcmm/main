(function(){
'use strict';
let draft=structuredClone(window.HPCMM_CONTENT), dirty=false, active='group';
const form=document.getElementById('editor-form'),status=document.getElementById('status');
const sections={group:'Group information',images:'Cover & group photos',research:'Research areas',publications:'Publications',members:'Group members',software:'Software',news:'News',contact:'Contact'};
const labels={shortName:'Short name',name:'Name',tagline:'Homepage introduction',intro:'About: opening paragraph',about:'About: description',note:'Draft note (leave empty to hide)',src:'Image',alt:'Image description for accessibility',caption:'Caption / credit',title:'Title',description:'Description',details:'Details',placeholder:'This is example content (show a placeholder label)',id:'Permanent identifier',authors:'Authors and journal',year:'Year',topic:'Topic',abstract:'Abstract',url:'Publication or repository link',role:'Role',biography:'Biography',interests:'Research interests',paperIds:'Selected publications',date:'Date',text:'News text',institution:'Institution / department',location:'City, country',email:'Contact email'};
const templates={research:{title:'New research area',description:'',details:'',placeholder:true},publications:{id:'',title:'New publication',authors:'',year:'',topic:'',abstract:'',url:'',placeholder:true},members:{id:'',name:'New member',role:'',biography:'',interests:'',paperIds:[],placeholder:true},software:{title:'New software',description:'',url:'',placeholder:true},news:{date:'',title:'New update',text:'',placeholder:true}};
function changed(){dirty=true;status.textContent='Draft changed. Preview or download when ready.';}
function el(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;}
function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;}
function validate(data){
 if(!data||data.schemaVersion!==1)throw Error('This file is not a supported website content file.');
 for(const k of Object.keys(sections)){if(!data[k]||typeof data[k]!=='object')throw Error('Missing section: '+k);}
 for(const k of ['group','contact'])for(const field of Object.keys(window.HPCMM_CONTENT[k]))if(typeof data[k][field]!=='string')throw Error('Invalid '+k+' field: '+field);
 for(const key of Object.keys(templates)){
  if(!Array.isArray(data[key]))throw Error('Invalid section: '+key);
  for(const item of data[key])for(const [field,value] of Object.entries(templates[key])){
   if(Array.isArray(value)){if(!Array.isArray(item[field])||item[field].some(v=>typeof v!=='string'))throw Error('Invalid selected publications.');}
   else if(typeof item[field]!==typeof value)throw Error('Invalid '+key+' field: '+field);
  }
 }
 for(const key of ['members','publications']){const ids=data[key].map(x=>x.id);if(ids.some(id=>!/^[a-z0-9][a-z0-9-]*$/.test(id))||new Set(ids).size!==ids.length)throw Error('Each '+key+' identifier must be unique, with lowercase letters, numbers and hyphens only.');}
 for(const key of ['cover','groupPhoto']){const im=data.images[key];if(!im||['src','alt','caption'].some(k=>typeof im[k]!=='string'))throw Error('Invalid image settings.');if(im.src&&!im.alt.trim())throw Error('Add an accessibility description for the '+(key==='cover'?'cover image':'group photo')+'.');if(im.src&&!/^(data:image\/(png|jpeg|webp);base64,|https?:\/\/|[\w./-]+\.(png|jpe?g|webp)$)/i.test(im.src))throw Error('Unsupported image format.');}
 for(const m of data.members)if(m.paperIds.some(id=>!data.publications.some(p=>p.id===id)))throw Error('A member refers to a publication that no longer exists.');
 for(const x of [...data.publications,...data.software])if(x.url&&!/^https?:\/\/\S+$/i.test(x.url))throw Error('Links must start with https:// or http://.');
 if(data.contact.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email))throw Error('Please enter a valid contact email or leave it empty.');
}
function field(obj,key){
 const label=el('label',undefined,'edit-field');label.append(el('span',labels[key]||key));
 if(key==='paperIds'){
  const box=el('fieldset',undefined,'paper-choices');box.append(el('legend','Selected publications'));
  if(!draft.publications.length)box.append(el('p','Add publications in the Publications section first.'));
  for(const p of draft.publications){const row=el('label');const input=el('input');input.type='checkbox';input.checked=obj.paperIds.includes(p.id);input.addEventListener('change',()=>{obj.paperIds=input.checked?[...obj.paperIds,p.id]:obj.paperIds.filter(id=>id!==p.id);changed();});row.append(input,el('span',p.title));box.append(row);}return box;
 }
 const bool=typeof obj[key]==='boolean';const multiline=['tagline','intro','about','description','details','abstract','biography','interests','text'].includes(key);const input=el(multiline?'textarea':'input');
 if(bool){label.classList.add('check');input.type='checkbox';input.checked=obj[key];}
 else{input.value=obj[key];if(key==='id'){input.readOnly=true;label.append(el('small','Assigned automatically. Kept stable so profile links and publication selections continue to work.'));}}
 input.addEventListener('input',()=>{obj[key]=bool?input.checked:input.value;changed();});label.append(input);return label;
}
function photoEditor(key,title){
 const obj=draft.images[key],card=el('section',undefined,'edit-card');card.append(el('h3',title));
 const label=el('label',undefined,'edit-field');label.append(el('span','Choose an image (PNG, JPG or WebP; up to 5 MB)'));const input=el('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';label.append(input);card.append(label);
 input.addEventListener('change',async()=>{const f=input.files[0];if(!f)return;if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>5*1024*1024){status.textContent='Choose a PNG, JPG or WebP image smaller than 5 MB.';return;}try{const reader=new FileReader();const result=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(f);});const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=result;});obj.src=result;changed();render();}catch{status.textContent='That file could not be read as an image.';}});
 if(obj.src){const img=el('img');img.src=obj.src;img.alt=obj.alt||'Selected photo preview';img.className='photo-preview';card.append(img,button('Remove image',()=>{obj.src='';changed();render();},'remove'));}
 else card.append(el('p','No image selected. The website will show a placeholder.'));
 card.append(field(obj,'alt'),field(obj,'caption'));return card;
}
function render(){
 form.replaceChildren(el('h2',sections[active]));document.querySelectorAll('#sections button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.section===active)));
 if(active==='images'){form.append(photoEditor('cover','Cover research image'),photoEditor('groupPhoto','Group photograph'));return;}
 const data=draft[active];
 if(!Array.isArray(data)){for(const key of Object.keys(data))form.append(field(data,key));return;}
 data.forEach((item,index)=>{const card=el('section',undefined,'edit-card');card.append(el('h3',(index+1)+'. '+(item.name||item.title)));for(const key of Object.keys(templates[active]))card.append(field(item,key));card.append(button('Remove this entry',()=>{if(!confirm('Remove this entry from the draft?'))return;const removed=data.splice(index,1)[0];if(active==='publications')draft.members.forEach(m=>m.paperIds=m.paperIds.filter(id=>id!==removed.id));changed();render();},'remove'));form.append(card);});
 form.append(button('Add '+({members:'member',publications:'publication',research:'research area',software:'software',news:'news item'}[active]),()=>{const item=structuredClone(templates[active]);if('id'in item)item.id=(active==='members'?'member-':'paper-')+crypto.randomUUID().slice(0,8);data.push(item);changed();render();},'primary'));
}
for(const [key,title]of Object.entries(sections)){const b=button(title,()=>{active=key;render();});b.dataset.section=key;document.getElementById('sections').append(b);}
form.addEventListener('submit',e=>e.preventDefault());
document.getElementById('download').addEventListener('click',()=>{try{validate(draft);const serialized='// Generated by editor.html. Upload this file alongside index.html.\nwindow.HPCMM_CONTENT = '+JSON.stringify(draft,null,2)+';\n';const url=URL.createObjectURL(new Blob([serialized],{type:'text/javascript'}));const a=el('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;status.textContent='Download prepared. Upload content.js to GitHub to publish; the live site has not changed yet.';}catch(e){status.textContent=e.message;}});
document.getElementById('import').addEventListener('change',async event=>{const f=event.target.files[0];if(!f)return;try{if(f.size>16*1024*1024)throw Error('This content file is too large.');let text=await f.text();if(text.includes('window.HPCMM_CONTENT = '))text=text.slice(text.indexOf('window.HPCMM_CONTENT = ')+23).trim().replace(/;\s*$/,'');const data=JSON.parse(text);validate(data);if(dirty&&!confirm('Replace the current unsaved draft with this file?'))return;draft=data;changed();render();status.textContent='Saved content loaded. Preview or edit it before downloading.';}catch(e){status.textContent='Could not load content: '+e.message;}event.target.value='';});
const dialog=document.getElementById('preview-dialog');
document.getElementById('preview').addEventListener('click',()=>{try{validate(draft);const json=JSON.stringify(draft).replace(/</g,'\\u003c');document.getElementById('draft-frame').srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="styles.css"></head><body data-page="home"><div class="prototype"></div><header><div class="nav-wrap"><a class="brand" href="index.html">HPC-MM</a></div></header><main id="main"></main><footer></footer><script>window.HPCMM_CONTENT='+json+';<\/script><script src="site.js"><\/script><script src="script.js"><\/script></body></html>';dialog.showModal();}catch(e){status.textContent=e.message;}});
document.getElementById('close-preview').addEventListener('click',()=>dialog.close());
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
render();
})();
