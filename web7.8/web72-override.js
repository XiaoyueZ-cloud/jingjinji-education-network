(function(){
  function resourcePanel(panel){
    panel.className='dash-panel web72-resource-panel';
    panel.innerHTML='<div class="web72-resource-title">教育资源分布概览</div><div class="web72-resource-grid">'
      +'<div class="web72-resource-item"><b>114</b><span>北京 · 高校</span></div><div class="web72-resource-item"><b>57</b><span>天津 · 高校</span></div><div class="web72-resource-item"><b>114</b><span>河北 · 高校</span></div><div class="web72-resource-item"><b>565</b><span>北京 · 科研平台</span></div><div class="web72-resource-item"><b>314</b><span>天津 · 科研平台</span></div><div class="web72-resource-item"><b>377</b><span>河北 · 科研平台</span></div>'
      +'<div class="web72-resource-item"><b>3,250</b><span>北京 · 中小学</span></div><div class="web72-resource-item"><b>1,520</b><span>天津 · 中小学</span></div><div class="web72-resource-item"><b>1.6万</b><span>河北 · 中小学</span></div><div class="web72-resource-item"><b>6.3万</b><span>北京 · 教师</span></div><div class="web72-resource-item"><b>4.0万</b><span>天津 · 教师</span></div><div class="web72-resource-item"><b>5.5万</b><span>河北 · 教师</span></div>'
      +'</div>';
  }
  function navFollow(){
    const labels=['首页','协同监测','一体化分析','资源地图','资源研究','AI分析','决策支持','系统管理'];
    const setActive=name=>document.querySelectorAll('header button').forEach(btn=>btn.classList.toggle('web72-nav-active',(btn.textContent||'').trim()===name));
    document.addEventListener('click',e=>{const btn=e.target.closest('header button');const name=(btn?.textContent||'').trim();if(labels.includes(name))setActive(name)},true);
    setActive('首页');
  }
  function fitNetwork(panel){
    const frame=panel.querySelector('iframe');if(!frame)return;
    frame.onload=()=>{try{const d=frame.contentDocument,style=d.createElement('style');style.textContent='.brand,.filters,.side{display:none!important}html,body{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;background:#07152e!important}.main,.network{position:fixed!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-height:0!important;background:#07152e!important;border:0!important}#canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;filter:invert(1) hue-rotate(180deg) brightness(.78) saturate(1.55)}.metrics{top:8px!important;left:8px!important;z-index:3!important}.legend{left:8px!important;right:8px!important;bottom:5px!important;z-index:3!important;font-size:9px!important}';d.head.appendChild(style);setTimeout(()=>frame.contentWindow.dispatchEvent(new Event('resize')),120)}catch(e){}};
  }
  function mount(){
    const main=document.querySelector('.dash-main.web7-home-grid');if(!main||main.dataset.web72)return false;
    const [oldLeft,oldCenter,oldRight]=main.children;if(!oldLeft||!oldCenter||!oldRight)return false;
    const [events,cloud]=oldLeft.children;const [map,active,resources]=oldCenter.children;const [forecast,network]=oldRight.children;
    if(!events||!cloud||!map||!active||!resources||!forecast||!network)return false;
    const left=document.createElement('div'),center=document.createElement('div'),right=document.createElement('div');left.className='web7-col web7-col--left';center.className='web7-col web7-col--center';right.className='web7-col web7-col--right';
    resourcePanel(resources);active.classList.add('web72-monthly');forecast.classList.add('web72-forecast');network.classList.add('web72-network-panel');fitNetwork(network);
    left.append(events,cloud,resources);center.append(map,active);right.append(forecast,network);main.replaceChildren(left,center,right);main.className='dash-main web7-home-grid web72-home-grid';main.dataset.web72='1';navFollow();return true;
  }
  let tries=0,timer=setInterval(()=>{if(mount()||++tries>100)clearInterval(timer)},100);
})();
