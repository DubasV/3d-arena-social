(function(root){
  'use strict';
  const rates={weekday:{esports:[180,490,870,800,540],comfort:[200,540,960,800,600]},weekend:{esports:[200,540,960,800,600],comfort:[220,600,1060,800,660]}};
  const packs={hour:[0,1,'1 час','В любое время'],three:[1,3,'3 часа','Пакет на 3 часа'],six:[2,6,'6 часов','Пакет на 6 часов'],night:[3,12,'Ночь','21:00–09:00 · акция'],morning:[4,5,'Утро','08:00–13:00']};
  const api={quote(day,hall,pack){const r=rates[day]?.[hall],p=packs[pack];return r&&p?{price:r[p[0]],hours:p[1],label:p[2],condition:p[3]}:null;}};
  if(typeof module==='object')module.exports=api;else root.ArenaPricing=api;
})(typeof window==='object'?window:globalThis);
