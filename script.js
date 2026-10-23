(function(){
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
function closeMenu(){ navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); }
menuButton?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
navigation?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape' && navigation?.classList.contains('open')){closeMenu();menuButton.focus();}});
const filters=document.querySelectorAll('[data-filter]');
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
 let count=0;
 document.querySelectorAll('[data-topic]').forEach(publication=>{publication.hidden=button.dataset.filter!=='all' && publication.dataset.topic!==button.dataset.filter;if(!publication.hidden)count++;});
 document.querySelector('#publication-count').textContent=`Showing ${count} publication${count===1?'':'s'}`;
}));

})();
