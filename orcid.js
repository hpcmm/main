/* Shared by the visual editor and GitHub's scheduled importer. No credentials required. */
(function(root){
'use strict';
function normalize(value){
 const id=String(value||'').trim().replace(/^https?:\/\/(www\.)?orcid\.org\//i,'').replace(/\/$/,'').toUpperCase();
 if(!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id))throw Error('Enter a valid ORCID iD, such as 0000-0002-1825-0097, or its orcid.org link.');
 const digits=id.replace(/-/g,'');let total=0;for(const digit of digits.slice(0,15))total=(total+Number(digit))*2;const check=(12-total%11)%11;
 if(digits[15]!== (check===10?'X':String(check)))throw Error('The ORCID check digit is incorrect. Please check the iD.');return id;
}
function doi(value){return String(value||'').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,'').toLowerCase();}
function doiOf(work){const id=(work['external-ids']?.['external-id']||[]).find(x=>x['external-id-type']?.toLowerCase()==='doi'&&(!x['external-id-relationship']||x['external-id-relationship']==='self'));return id?doi(id['external-id-value']):'';}
function publicationDoi(p){return doi(p.doi||(/^https?:\/\/(dx\.)?doi\.org\//i.test(p.url||'')?p.url:''));}
function migrate(d){for(const m of d.members){m.orcid??='';m.autoSync??=false;m.orcidExcluded??=[];m.photo??={src:'',alt:'',caption:''};for(const key of ['cienciavitae','researchgate','linkedin','website','email'])m[key]??='';}for(const paper of d.publications)paper.publicationDate??='';return d;}
function summaries(record,id){
 if(!Array.isArray(record.group))throw Error('ORCID returned an unexpected works response; existing publications were kept.');
 const result=new Map();for(const g of record.group){const w=[...(g['work-summary']||[])].sort((a,b)=>Number(b['display-index']||0)-Number(a['display-index']||0))[0];if(!w)continue;const title=w.title?.title?.value;if(!title||w['put-code']==null)continue;const d=doiOf(w)||doiOf(g);const key=d?'doi:'+d:'orcid:'+id+':'+w['put-code'];result.set(key,{key,orcid:id,putCode:w['put-code'],doi:d,title,year:w['publication-date']?.year?.value||'',publicationDate:[w['publication-date']?.year?.value,w['publication-date']?.month?.value,w['publication-date']?.day?.value].filter(Boolean).map((v,i)=>i?String(v).padStart(2,'0'):String(v)).join('-'),journal:w['journal-title']?.value||'',url:d?'https://doi.org/'+d:w.url?.value||'https://orcid.org/'+id,workType:w.type||'work'});}
 return [...result.values()].sort((a,b)=>b.year.localeCompare(a.year)||a.title.localeCompare(b.title));
}
async function request(path,fetcher=fetch){
 for(let attempt=0;attempt<3;attempt++){
  let response;try{response=await fetcher('https://pub.orcid.org/v3.0/'+path,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});}catch(e){if(attempt===2)throw Error('Could not reach ORCID. Try again later; your existing publications are unchanged.');await new Promise(r=>setTimeout(r,500*(attempt+1)));continue;}
  if(response.ok)return response.json();
  if((response.status===429||response.status>=500)&&attempt<2){await new Promise(r=>setTimeout(r,1000*(attempt+1)));continue;}
  throw Error(response.status===404?'ORCID record not found. Check the iD.':'ORCID request failed ('+response.status+'). Try again later.');
 }
}
async function list(value,fetcher){const id=normalize(value);return summaries(await request(id+'/works',fetcher),id);}
async function details(candidate,fetcher){const w=await request(candidate.orcid+'/work/'+candidate.putCode,fetcher);const authors=(w.contributors?.contributor||[]).map(x=>x['credit-name']?.value).filter(Boolean).join(', ');return {...candidate,journal:w['journal-title']?.value||candidate.journal,authors,abstract:w['short-description']||''};}
function find(d,c){return d.publications.find(p=>(c.doi&&publicationDoi(p)===c.doi)||(p.orcidKeys||[]).includes(c.key));}
function attach(d,m,c){
 let p=find(d,c);let added=false;
 if(!p){let id='orcid-'+c.orcid.replace(/-/g,'').toLowerCase()+'-'+c.putCode;let n=2;while(d.publications.some(p=>p.id===id))id+='-'+n++;
 p={id,title:c.title,authors:[c.authors,c.journal].filter(Boolean).join(' · ')||'Citation details not supplied in ORCID',year:c.year,publicationDate:c.publicationDate||'',topic:'Publications',abstract:c.abstract||'',url:/^https?:\/\//i.test(c.url)?c.url:'https://orcid.org/'+c.orcid,placeholder:false,doi:c.doi,orcidKeys:[c.key],source:'orcid'};d.publications.push(p);added=true;
 }else{if(!p.publicationDate&&c.publicationDate)p.publicationDate=c.publicationDate;p.orcidKeys=Array.from(new Set([...(p.orcidKeys||[]),c.key]));}
 if(!m.paperIds.includes(p.id))m.paperIds.push(p.id);return {publication:p,added};
}
// Removing a selection should not let the next scheduled run silently add it back.
function exclude(m,p){m.orcidExcluded=Array.from(new Set([...(m.orcidExcluded||[]),...(p.orcidKeys||[]),...(publicationDoi(p)?['doi:'+publicationDoi(p)]:[])]));}
function include(m,p){const keys=[...(p.orcidKeys||[]),...(publicationDoi(p)?['doi:'+publicationDoi(p)]:[])];m.orcidExcluded=(m.orcidExcluded||[]).filter(k=>!keys.includes(k));}
const api={normalize,doi,publicationDoi,migrate,summaries,request,list,details,find,attach,exclude,include};root.HPCMM_ORCID=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
