/* Presentation only. Colleagues edit content through editor.html. */
(async function renderSite(previewMember){
await window.HPCMM_CONTENT_READY;
const d=window.HPCMM_CONTENT;if(!d)return;
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=v=>/^https?:\/\//i.test(v||'')?e(v):'';
const imageSrc=v=>/^(data:image\/(png|jpeg|webp);base64,|https?:\/\/)/i.test(v||'')||/^[\w./-]+\.(png|jpe?g|webp|svg)$/i.test(v||'')?e(v):'';
const recent=window.HPCMM_PUBLICATIONS.newest;
const memberLinks=m=>{const items=[['CIÊNCIAVITAE',m.cienciavitae],['ResearchGate',m.researchgate],['LinkedIn',m.linkedin],['Website',m.website]];let links=/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(m.orcid||'')?`<a href="https://orcid.org/${e(m.orcid)}">ORCID ↗</a>`:'';links+=items.filter(([,url])=>link(url)).map(([name,url])=>`<a href="${link(url)}">${name} ↗</a>`).join('');if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email||''))links+=`<a href="mailto:${e(m.email)}">${e(m.email)}</a>`;return links?`<div class="member-links">${links}</div>`:'';};
const portrait=m=>m.photo&&imageSrc(m.photo.src)?`<img class="member-photo" src="${imageSrc(m.photo.src)}" alt="${e(m.photo.alt||m.name)}" loading="${document.body.dataset.page==='home'?'lazy':'eager'}" decoding="async">`:'';
const mark=v=>v?' · Placeholder':'';
const photo=(item,group=false)=>`<figure class="${group?'group-photo':'hero-art'}">${imageSrc(item.src)?`<img src="${imageSrc(item.src)}" alt="${e(item.alt)}" ${group?'loading="lazy" decoding="async"':'fetchpriority="high" decoding="async"'}>`:`<div class="group-image-placeholder"><span>${group?'Group photograph':'Cover research image'}</span><small>Image to be added</small></div>`}<figcaption>${e(item.caption)}</figcaption></figure>`;
const pubs=items=>items.map(p=>`<article class="publication" id="${e(p.id)}" data-topic="${e(p.topic)}"><span class="pub-year">${e(p.publicationDate?.slice(0,4)||p.year)}</span><div><p class="eyebrow">${e(p.topic)}${mark(p.placeholder)}</p><h3>${e(p.title)}</h3><p>${e(p.authors)}</p>${p.abstract?`<details><summary>Read abstract <span>+</span></summary><p>${e(p.abstract)}</p></details>`:''}${link(p.url)?`<a class="text-link" href="${link(p.url)}">View publication ↗</a>`:''}</div></article>`).join('');
const publicationYear=p=>window.HPCMM_PUBLICATIONS.dateKey(p).slice(0,4)||'Undated';
const yearPubs=(items,previousYear='')=>items.map(p=>{const year=publicationYear(p);const title=year!==previousYear?`<h3 class="publication-year-heading">${e(year)}</h3>`:'';previousYear=year;return title+pubs([p]);}).join('');
const heading=(title,note='')=>`<div class="section-heading"><h2>${e(title)}</h2>${note?`<p>${e(note)}</p>`:''}</div>`;
const roles=['Group Leader','Academic Staff','Junior Researcher','Postdoc','PhD','MSc','Research software engineer','Other'];
const roleOf=m=>/^(PI|Group Leader)$/i.test(m.roleCategory)?'Group Leader':/^Academic Staff$/i.test(m.roleCategory)?'Academic Staff':m.roleCategory==='Post-Doc'?'Postdoc':roles.includes(m.roleCategory)?m.roleCategory:(/group leader|principal investigator/i.test(m.role)?'Group Leader':/junior research/i.test(m.role)?'Junior Researcher':/post.?doc/i.test(m.role)?'Postdoc':/professor|lecturer|academic staff|faculty/i.test(m.role)?'Academic Staff':/research software engineer/i.test(m.role)?'Research software engineer':/doctoral|phd/i.test(m.role)?'PhD':/master|msc/i.test(m.role)?'MSc':'Other');
const orderedMembers=members=>[...members].sort((a,b)=>roles.indexOf(roleOf(a))-roles.indexOf(roleOf(b))||a.name.localeCompare(b.name));
const entries=v=>String(v||'').split(/[;,\n]/).map(x=>x.trim()).filter(Boolean);
const tags=v=>'<ul class="keyword-list">'+entries(v).map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>';
const records=v=>String(v||'').split('\n').map(row=>row.split('|').map(x=>x.trim())).filter(x=>x[0]);
const projects=r=>records(r.projects).map(([name,doi])=>{
 const id=(doi||'').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'');
 return '<li>'+e(name)+(/^10\.\d{4,}\/\S+$/.test(id)?' <a href="https://doi.org/'+e(encodeURI(id))+'">View DOI ↗</a>':'')+'</li>';
}).join('');
const roster=(title,v,filter=false)=>{
 const rows=records(v).sort(([a],[b])=>a.localeCompare(b));
 const affiliations=[...new Set(rows.map(([,aff])=>aff).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 return (title?'<h3>'+title+'</h3>':'')+(filter&&affiliations.length?'<label class="site-filter">Affiliation <select id="former-affiliation"><option value="">All affiliations</option>'+affiliations.map(a=>'<option value="'+e(a)+'">'+e(a)+'</option>').join('')+'</select></label>':'')+(rows.length?'<ul class="plain-roster">'+rows.map(([name,aff])=>'<li data-affiliation="'+e(aff||'')+'"><strong>'+e(name)+'</strong>'+ (aff?' · '+e(aff):'')+'</li>').join('')+'</ul>':'<p>No entries listed yet.</p>');
};
const main=document.querySelector('main');const filename=location.pathname.split('/').pop();const isHome=!previewMember&&(document.body.dataset.page==='home'||!filename||filename==='index.html');
const banner=document.querySelector('.prototype');if(banner){const samples=['research','publications','members','software','news'].some(k=>d[k].some(x=>x.placeholder));banner.textContent=samples?'Website draft · Example content is marked as placeholder.':'';banner.hidden=!samples;}
main.className=isHome?'':'wrap member-page';
if(isHome){
 document.title=d.group.shortName+' — '+d.group.name;
 main.innerHTML=`<section class="hero wrap" id="home"><div class="hero-copy"><p class="eyebrow">${e(d.group.shortName)} / RESEARCH GROUP</p><h1>${e(d.group.name)}</h1><p class="hero-description">${e(d.group.tagline)}</p><div class="actions"><a class="button" href="#research">Research</a><a class="text-link" href="#publications">Publications</a></div></div><div id="molecule-gallery"></div></section>
 <section id="about" class="wrap section about about-with-photo"><div><h2>The group</h2><p class="lead">${e(d.group.intro)}</p>${d.group.about.split(/\n\s*\n/).map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}${d.group.note?`<p class="editor-note">${e(d.group.note)}</p>`:''}</div>${photo(d.images.groupPhoto,true)}</section>
 <section id="research" class="tinted"><div class="wrap section">${heading('Research topics')}<div class="research-grid">${d.research.map(r=>`<article><h3>${e(r.title)}</h3><p>${e(r.description)}${r.placeholder?'<br><small>Proposed theme · Placeholder</small>':''}</p>${r.details?`<details><summary>Topic details <span>+</span></summary><p>${e(r.details)}</p></details>`:''}${`<h4>Projects</h4>${projects(r)?`<ul>${projects(r)}</ul>`:'<p class="project-empty">Project DOIs to be added.</p>'}`}</article>`).join('')}</div></div></section>
 <section id="publications" class="wrap section">${heading('Publications','Browse publications by year')}<label class="site-filter">Publication year <select id="pub-year"></select></label><div class="publication-list" id="year-results" aria-live="polite"></div></section>
 <section id="people" class="tinted"><div class="wrap section">${heading('People')}<div class="people-switch" role="group" aria-label="Filter current members by role">${['All',...roles].map((role,i)=>`<button type="button" data-team-role="${e(role)}" aria-pressed="${i===0}">${e(role)}</button>`).join('')}</div><p id="team-empty" hidden>No members in this category.</p><div class="people-grid">${orderedMembers(d.members).map(m=>`<article class="member-directory-card" data-role="${e(roleOf(m))}"><a class="member-link" href="member.html?id=${encodeURIComponent(m.id)}">${portrait(m)}<div><h3>${e(m.name)}</h3><p>${e(m.role)}${mark(m.placeholder)}</p><span class="profile-link-label">View profile →</span></div></a>${memberLinks(m)}</article>`).join('')}</div><p><a class="text-link" href="former-members.html">Former members →</a></p><div class="collaboration-layout"><section id="collaborators" class="collaborators">${roster('Collaborators',d.group.collaborators)}</section><section class="affiliation-map" aria-labelledby="affiliation-map-title"><h3 id="affiliation-map-title">Where we work</h3><p>Explore the institutions connected to our group.</p><div id="affiliation-map-content"></div></section></div></div></section>
 <section id="software" class="software"><div class="wrap section software-grid"><div><h2>Resources</h2><p>Software and supporting materials.</p></div><div>${d.software.map(s=>`<article class="software-item"><div>${s.placeholder?'<p class="eyebrow">Example software · Placeholder</p>':''}<h3>${e(s.title)}</h3><p>${e(s.description)}</p>${link(s.url)?`<a class="text-link" href="${link(s.url)}">Open resource ↗</a>`:''}</div></article>`).join('')}</div></div></section>
 <section id="news" class="wrap section">${heading('Group news')}<div class="news-grid">${d.news.map(n=>`<article><p class="eyebrow">${e(n.date)}${mark(n.placeholder)}</p><h3>${e(n.title)}</h3><p>${e(n.text)}</p></article>`).join('')}</div></section>`;
 const yearSelect=document.getElementById('pub-year'), yearNow=new Date().getFullYear();
 const years=Array.from({length:11},(_,i)=>String(yearNow-i));
 const ordered=recent(d.publications,d.publications.length);
 yearSelect.replaceChildren(...years.map(y=>new Option(y,y)));
 yearSelect.value=years.find(y=>ordered.some(p=>publicationYear(p)===y))||years[0];
 const renderYear=()=>{document.getElementById('year-results').innerHTML=pubs(ordered.filter(p=>publicationYear(p)===yearSelect.value))||'<p>No publications listed for this year.</p>';};
 yearSelect.addEventListener('change',renderYear);renderYear();
 const roleButtons=main.querySelectorAll('[data-team-role]');
 roleButtons.forEach(button=>button.addEventListener('click',()=>{
  roleButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const role=button.dataset.teamRole;
  let count=0;main.querySelectorAll('[data-role]').forEach(card=>{card.hidden=role!=='All'&&card.dataset.role!==role;if(!card.hidden)count++;});
  document.getElementById('team-empty').hidden=!!count;
 }));
 const cover={...d.images.cover};if(/^research image to be supplied by the group[.!]?$/i.test(cover.caption?.trim()||''))cover.caption='';
 const slides=[cover,...records(d.group.moleculeSlides).map(([src,alt,caption])=>({src,alt,caption}))].filter(x=>x&&imageSrc(x.src)).filter((x,i,all)=>all.findIndex(y=>y.src===x.src)===i);
 if(slides.length===1&&slides[0].src===d.images.cover.src)slides.push({...slides[0],detail:true,caption:'Detail of the cover image'});
 const gallery=document.getElementById('molecule-gallery');
 gallery.innerHTML=slides.length?photo({...slides[0],caption:''}):'<figure class="hero-art"><div class="group-image-placeholder"><span>Molecular slideshow</span><small>Images to be added</small></div></figure>';
 if(slides.length>1){
  let index=0;
  gallery.innerHTML='<div class="slide-content" aria-live="polite"></div><div class="slide-controls"><button type="button" aria-label="Previous image">←</button><span></span><button type="button" aria-label="Next image">→</button></div>';
  const show=()=>{const slide=slides[index],content=gallery.querySelector('.slide-content');content.classList.toggle('slide-detail',!!slide.detail);content.innerHTML=photo({...slide,caption:''});gallery.querySelector('.slide-controls span').textContent=(index+1)+' / '+slides.length;};
  gallery.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>{index=(index+(i?1:-1)+slides.length)%slides.length;show();}));show();
 }
 window.HPCMM_AFFILIATION_MAP?.(document.getElementById('affiliation-map-content'),d);
}else if(filename==='former-members.html'){
 document.title='Former members — '+d.group.shortName;
 main.innerHTML='<a class="member-back" href="index.html#people">← People</a><h1>Former members</h1>'+roster('',d.group.formerMembers,true);
 const affiliation=document.getElementById('former-affiliation');
 affiliation?.addEventListener('change',()=>main.querySelectorAll('[data-affiliation]').forEach(row=>row.hidden=!!affiliation.value&&row.dataset.affiliation!==affiliation.value));
}else{
 const id=previewMember||new URLSearchParams(location.search).get('id')||filename.replace(/\.html$/,'');const m=d.members.find(m=>m.id===id);
 if(!m){main.innerHTML='<h1>Profile not found</h1><p>This member may have moved or been removed.</p><a class="text-link" href="index.html#people">Return to group members</a>';document.title='Profile not found — '+d.group.shortName;}
 else{document.title=m.name+' — '+d.group.shortName;const papers=[...new Set(m.featuredPaperIds||[])].slice(0,5).map(id=>d.publications.find(p=>p.id===id)).filter(Boolean);main.innerHTML=`<a class="member-back" href="index.html#people">← Group members</a><div class="member-intro member-intro-photo"><div>${m.placeholder?'<p class="eyebrow">Example profile · Placeholder</p>':''}<h1>${e(m.name)}</h1><p class="member-role">${e(m.role)}</p>${memberLinks(m)}</div>${m.photo&&imageSrc(m.photo.src)?`<figure>${portrait(m)}${m.photo.caption?`<figcaption>${e(m.photo.caption)}</figcaption>`:''}</figure>`:''}</div><div class="member-content"><div><section><h2>Biography</h2><p class="preserve-lines">${e(m.biography)}</p></section><section><h2>Research expertise</h2>${m.expertise?tags(m.expertise):'<p>Techniques will be added by this member.</p>'}</section></div><section><h2>Featured Research</h2>${papers.length?pubs(papers):'<p>No featured papers selected yet.</p>'}</section></div>`;
 }
}
const footer=document.querySelector('footer');if(footer)footer.innerHTML=`<div class="wrap footer-top"><div><a class="footer-brand" href="index.html">${e(d.group.shortName)}</a><p>${e(d.group.name)}</p></div><div><p class="eyebrow">AFFILIATION & CONTACT</p><p>${e(d.contact.institution)}<br>${e(d.contact.location)}</p>${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact.email)?`<a href="mailto:${e(d.contact.email)}">${e(d.contact.email)}</a>`:''}</div></div><div class="wrap footer-bottom"><span>${e(d.group.shortName)}</span><div class="partner-logos">${[['FCUP',d.group.fcupLogo,'https://www.up.pt/fcup/'],['LAQV–REQUIMTE','assets/partners/laqv-requimte.png','https://laqv.requimte.pt/']].map(([name,src,url])=>`<a href="${url}">${imageSrc(src)?`<img src="${imageSrc(src)}" alt="${name}">`:name}</a>`).join('')}</div></div>`;
document.querySelectorAll('.brand').forEach(b=>{b.setAttribute('aria-label',d.group.shortName+' home');b.innerHTML='<svg width="32" height="34" viewBox="0 0 32 34" aria-hidden="true"><path d="M6 9L23 4 27 24 10 29 6 9 27 24M23 4L10 29" fill="none" stroke="currentColor"/><g fill="currentColor"><circle cx="6" cy="9" r="3"/><circle cx="23" cy="4" r="3"/><circle cx="27" cy="24" r="3"/><circle cx="10" cy="29" r="3"/></g></svg>';});
if(document.body.dataset.page==='home')document.onclick=event=>{
 const a=event.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';
 if(href.startsWith('#')){event.preventDefault();document.getElementById(href.slice(1))?.scrollIntoView();}
 else if(href.startsWith('member.html?')||href.startsWith('index.html')){event.preventDefault();renderSite(href.startsWith('member.html?')?new URL(href,location.href==='about:srcdoc'?document.baseURI:location.href).searchParams.get('id'):undefined);const script=document.createElement('script');script.src='script.js';document.body.append(script);window.scrollTo(0,0);}
};
// Fragment targets are created by this script; scroll once the layout exists.
requestAnimationFrame(()=>{const id=decodeURIComponent(location.hash.slice(1));if(id)document.getElementById(id)?.scrollIntoView();});
})();
