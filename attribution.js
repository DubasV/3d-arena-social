(function(root){
  'use strict';
  const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid','etext','rb_clickid','vk_click_id','gclid'];
  const clean=obj=>Object.fromEntries(keys.filter(k=>typeof obj?.[k]==='string'&&obj[k]).map(k=>[k,obj[k].slice(0,300)]));
  const api={resolve(search,saved,now=Date.now()){
    const incoming=clean(Object.fromEntries(new URLSearchParams(search)));
    if(Object.keys(incoming).length)return {at:now,params:incoming};
    if(saved&&Number.isFinite(saved.at)&&now-saved.at>=0&&now-saved.at<30*86400000)return {at:saved.at,params:clean(saved.params)};
    return {at:now,params:{}};
  },bookingURL(base,params,variant){const u=new URL(base);Object.entries(clean(params)).forEach(([k,v])=>u.searchParams.set(k,v));u.searchParams.set('arena_variant',variant);return u.href;}};
  if(typeof module==='object')module.exports=api;else root.ArenaAttribution=api;
})(typeof window==='object'?window:globalThis);
