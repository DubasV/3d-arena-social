(() => {
  'use strict';
  const variant=document.body.dataset.variant;
  const config=window.ARENA_CONFIG||{};
  let saved=null;
  try{saved=JSON.parse(localStorage.getItem('arena_attribution_v2'));}catch{}
  const attribution=window.ArenaAttribution.resolve(location.search,saved);
  try{localStorage.setItem('arena_attribution_v2',JSON.stringify(attribution));}catch{}
  document.querySelectorAll('a[data-booking]').forEach(a=>{a.href=window.ArenaAttribution.bookingURL(a.href,attribution.params,variant);});
  function track(goal,details={}){
    const data={variant,...details};
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'arena_event',goal,...data});
    if(config.metrikaId&&typeof window.ym==='function')window.ym(config.metrikaId,'reachGoal',goal,data);
  }
  if(config.metrikaId){
    window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};window.ym.l=Date.now();
    const script=document.createElement('script');script.async=true;script.src='https://mc.yandex.ru/metrika/tag.js';document.head.appendChild(script);
    window.ym(config.metrikaId,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false,params:{arena_variant:variant}});
  }
  if(document.querySelector('.hero-select, .hero-social'))track('variant_view');
  document.addEventListener('click',e=>{const el=e.target.closest('[data-track]');if(el)track(el.dataset.track,{placement:el.dataset.placement||el.closest('section')?.id||'navigation'});});
  const menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav-links');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  if(menu && nav)document.documentElement.classList.add('enhanced');
  nav?.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();}});
  const picker=document.querySelector('#price-picker');
  if(picker){
    picker.hidden=false;
    function update(report=false){
      const day=picker.querySelector('[name=day]').value,hall=picker.querySelector('[name=hall]').value,pack=picker.querySelector('[name=pack]').value;
      const q=window.ArenaPricing.quote(day,hall,pack);
      picker.querySelector('#quote-price').textContent=q.price.toLocaleString('ru-RU')+' ₽';
      picker.querySelector('#quote-label').textContent=(hall==='esports'?'Киберспорт':'Комфорт')+' · '+q.label+' · за 1 место';
      picker.querySelector('#quote-condition').textContent=q.condition+(pack==='night'?' · оплата рублями · после 22:00 — 18+':'');
      if(report)track('price_selection',{hall,day,pack});
    }
    picker.addEventListener('change',()=>update(true));update();
    document.querySelectorAll('[data-choose-hall]').forEach(el=>el.addEventListener('click',()=>{picker.querySelector('[name=hall]').value=el.dataset.chooseHall;update(true);}));
  }
  const dialog=document.querySelector('#photo-dialog');
  let opener;
  document.querySelectorAll('[data-photo]').forEach(a=>a.addEventListener('click',e=>{
    if(!dialog?.showModal)return;e.preventDefault();opener=a;
    dialog.querySelector('img').src=a.href;dialog.querySelector('img').alt=a.querySelector('img').alt;
    dialog.querySelector('p').textContent=a.querySelector('img').alt;dialog.showModal();
  }));
  dialog?.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog?.addEventListener('close',()=>opener?.focus());
})();
