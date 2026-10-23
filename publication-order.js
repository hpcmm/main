(function(root){
function validDate(s){if(!/^\d{4}(-\d{2}){0,2}$/.test(s||''))return false;const [y,m,d]=s.split('-').map(Number);if(y<1000||y>9999)return false;if(m!==undefined&&(m<1||m>12))return false;if(d!==undefined&&(d<1||d>new Date(Date.UTC(y,m,0)).getUTCDate()))return false;return true;}
function dateKey(p){const s=validDate(p.publicationDate)?p.publicationDate:/^\d{4}$/.test(p.year||'')?p.year:'';return s?s.split('-').concat(['00','00']).slice(0,3).join('-'):'';}
function newest(items,limit=Infinity){const seen=new Set();return [...items].sort((a,b)=>dateKey(b).localeCompare(dateKey(a))||String(a.title).localeCompare(String(b.title))).filter(p=>{const doi=String(p.doi||(/^https?:\/\/(dx\.)?doi\.org\//i.test(p.url||'')?p.url:'')).replace(/^https?:\/\/(dx\.)?doi\.org\//i,'').trim().toLowerCase();const key=doi?'doi:'+doi:'id:'+p.id;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit);}
const api={validDate,dateKey,newest};root.HPCMM_PUBLICATIONS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
