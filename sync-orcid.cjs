#!/usr/bin/env node
'use strict';
const fs=require('node:fs');const path=require('node:path');
const site=path.resolve(process.argv[2]||'.');const api=require(path.join(site,'orcid.js'));
async function run(){
 const file=path.join(site,'content.js'),original=fs.readFileSync(file,'utf8');const marker='window.HPCMM_CONTENT = ';const at=original.indexOf(marker);if(at<0)throw Error('Cannot find the website content object.');
 const data=api.migrate(JSON.parse(original.slice(at+marker.length).trim().replace(/;\s*$/,'')));
 const before=JSON.stringify(data);let added=0,linked=0;const problems=[];
 for(const member of data.members.filter(m=>m.autoSync)){
  try{
   const id=api.normalize(member.orcid);const candidates=await api.list(id);member.orcid=id;
   for(const c of candidates){
    if(member.orcidExcluded.includes(c.key))continue;
    let candidate=c;if(!api.find(data,c))candidate=await api.details(c);
    const previous=member.paperIds.length;const result=api.attach(data,member,candidate);if(result.added)added++;if(member.paperIds.length>previous)linked++;
    await new Promise(resolve=>setTimeout(resolve,150));
   }
   console.log('Checked '+id+': '+candidates.length+' public works.');
  }catch(e){problems.push(member.id+': '+e.message);}
 }
 // No partial saves: a failed request must never replace a working published file.
 if(problems.length)throw Error('No file changes saved. '+problems.join('; '));
 if(JSON.stringify(data)!==before){const tmp=file+'.tmp';fs.writeFileSync(tmp,'// Updated by the ORCID sync workflow. Edit through editor.html.\nwindow.HPCMM_CONTENT = '+JSON.stringify(data,null,2)+';\n');fs.renameSync(tmp,file);}
 console.log('Added '+added+' publication(s); created '+linked+' member association(s). Existing text and manually entered publications were preserved.');
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
