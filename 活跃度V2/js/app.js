/* 数据接口：固定读取 data/monthly_summary.json 与 data/event_details.json。
   将来由 scripts/excel_to_json.py 生成同名文件即可，无需改动本文件。 */
const CATEGORIES = ['资源共享','人才培养','办学合作','产教科教融合','治理机制'];
const COLORS = {资源共享:'#44d5ff',人才培养:'#8b8cff',办学合作:'#f7b84b',产教科教融合:'#4ee6ad',治理机制:'#f477b8'};
let monthly = [], events = [], currentIndex = 0, playing = true, timer, eventTimer, eventOffset = 0, chart, hovering = false;
const $ = id => document.getElementById(id);
const fmtMonth = m => `${m.slice(0,4)}年${m.slice(5)}月`;

async function loadData(){
  try { [monthly, events] = await Promise.all(['data/monthly_summary.json','data/event_details.json'].map(u => fetch(u).then(r => { if(!r.ok) throw Error(); return r.json(); }))); if(monthly.length < 43) monthly = createDirectOpenMock(); }
  catch(e) { if (window.EMBEDDED_ACTIVITY_DATA) { monthly = window.EMBEDDED_ACTIVITY_DATA.monthly; events = window.EMBEDDED_ACTIVITY_DATA.events; } else { monthly = createDirectOpenMock(); events = createMockEvents(); } }
}
function createDirectOpenMock(){
  const result=[]; let y=2023,m=1;
  while(y<2026 || (y===2026 && m<=7)){ const t=(y-2023)*12+m-1, wave=Math.sin(t*.38)*17+Math.sin(t*1.71)*13, trend=t*.32; const values=[.24,.21,.28,.15,.12].map((w,i)=>Math.max(0,Math.round((62+trend+wave+Math.sin(t*(.23+i*.19))*10)*w))); result.push({month:`${y}-${String(m).padStart(2,'0')}`,categories:Object.fromEntries(CATEGORIES.map((c,i)=>[c,values[i]])),total:values.reduce((a,b)=>a+b,0)}); m++; if(m>12){m=1;y++;} } return result;
}
function createMockEvents(){ return [{eventId:'DEMO-01',month:'2024-02',eventName:'京津冀高校联合建设综合实验基地',subject:'京津冀三地高校',region:'京津冀',source:'虚拟新闻来源',scores:[{category:'资源共享',subcategory:'基地设施共享',score:5},{category:'人才培养',subcategory:'联合培养',score:5},{category:'办学合作',subcategory:'校际合作协议',score:3}]}]; }
function initChart(){
  chart = echarts.init($('chart'));
  $('legend').innerHTML = ['月度总活跃度',...CATEGORIES].map(n => `<span><i style="background:${n==='月度总活跃度'?'#ffffff':COLORS[n]}"></i>${n}</span>`).join('');
  chart.on('mouseover', p => { if(p.componentType === 'series') { hovering = true; stop(); if(p.dataIndex != null) setMonth(p.dataIndex); } });
  chart.on('mouseout', p => { if(p.componentType === 'series') { hovering = false; if(playing) start(); } });
  chart.on('click', p => { if(p.dataIndex != null) { setMonth(p.dataIndex); playing = true; $('play').textContent = 'Ⅱ'; start(); } });
  window.addEventListener('resize', () => chart.resize()); renderChart();
}
function totalBarColor(index){
  return index===currentIndex
    ? new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#56d8ff'},{offset:1,color:'#0874d4'}])
    : new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(43,138,255,.76)'},{offset:1,color:'rgba(10,71,158,.62)'}]);
}
function renderChart(){
  const months = monthly.map(x=>x.month), mark = monthly[currentIndex];
  // 保持完整时间轴；当前月以后的数据设为空，使柱子和折线从左向右逐月生长。
  const visible = (value,index) => index <= currentIndex ? value : '-';
  const series = [{name:'月度总活跃度',type:'bar',animation:false,data:monthly.map((x,i)=>({value:visible(x.total,i),itemStyle:{color:totalBarColor(i)}})),barMaxWidth:22,z:1,
    markLine:{silent:true,symbol:'none',lineStyle:{color:'#63ddff',width:2},label:{formatter:fmtMonth(mark.month),color:'#c8f4ff',backgroundColor:'rgba(3,38,78,.9)',padding:[4,6]},data:[{xAxis:mark.month}]}}];
  CATEGORIES.forEach(n => series.push({name:n,type:'line',yAxisIndex:1,data:monthly.map((x,i)=>visible(x.categories[n]||0,i)),smooth:false,symbol:'none',lineStyle:{width:1.6,color:COLORS[n],shadowBlur:4,shadowColor:COLORS[n]},z:4}));
  chart.setOption({animationDuration:100,animationEasing:'linear',grid:{left:50,right:58,top:35,bottom:37},tooltip:{trigger:'axis',backgroundColor:'rgba(2,20,48,.96)',borderColor:'#2a6b96',textStyle:{color:'#eaf4ff'},formatter:ps => tooltip(ps[0].axisValue)},xAxis:{type:'category',data:months,axisLine:{lineStyle:{color:'#70849c'}},axisLabel:{color:'#d0d8e4',fontSize:12,interval:3,formatter:v=>v.slice(0,4)+'-'+v.slice(5)},axisTick:{show:true,lineStyle:{color:'#70849c'}}},yAxis:[{type:'value',name:'总活跃度',nameTextStyle:{color:'#c1ccdb',fontWeight:'bold'},splitLine:{lineStyle:{color:'rgba(32,108,185,.2)'}},axisLabel:{color:'#c4d2e1',fontSize:14}},{type:'value',name:'分类得分',nameTextStyle:{color:'#91a8bd'},splitLine:{show:false},axisLabel:{color:'#91a8bd'}}],series});
}
function tooltip(month){ const x=monthly.find(v=>v.month===month); const max=Math.max(...CATEGORIES.map(c=>x.categories[c])); return `<b>${fmtMonth(month)}</b><br/>总活跃度：<b style="color:#ffc766">${x.total}</b><div style="margin-top:8px">${CATEGORIES.map(c=>`${c}　${x.categories[c]}　<span style="display:inline-block;width:${Math.round(x.categories[c]/max*70)}px;height:6px;background:${COLORS[c]};border-radius:4px"></span>`).join('<br/>')}</div>`; }
function setMonth(index){ currentIndex=(index+monthly.length)%monthly.length; const row=monthly[currentIndex]; $('currentMonth').textContent=fmtMonth(row.month); $('timelineLabel').textContent=row.month; $('timeline').value=currentIndex; $('structureMonth').textContent=fmtMonth(row.month); $('totalScore').textContent=row.total; renderBars(row); renderEvents(row.month); renderChart(); }
function renderBars(row){ const max=Math.max(...CATEGORIES.map(c=>row.categories[c])); $('categoryBars').innerHTML=CATEGORIES.map(c=>`<div class="bar-row"><span>${c}</span><div class="bar-track"><div class="bar-fill" style="width:${max?row.categories[c]/max*100:0}%;background:${COLORS[c]}"></div></div><span class="bar-value">${row.categories[c]}</span></div>`).join(''); }
function renderEvents(month){ const list=events.filter(e=>e.month===month); $('eventCount').textContent=`${list.length} 条`; eventOffset=0; const fallback={eventName:'本月暂无可展示的协同事件',subject:'—',region:'—',source:'',scores:[]}; const visible=list.length?list:[fallback]; $('eventList').innerHTML=visible.map(eventCard).join(''); $('eventList').style.transform='none'; $('eventList').parentElement.scrollTop=0; resetEventScroll(visible.length); }
function eventCard(e){ return `<article class="event-card"><div class="event-name">${e.eventName}</div><div class="event-meta">${e.subject||'未知主体'} · ${e.region||'未知地区'}${e.source?' · '+e.source:''}</div><div class="score-tags">${e.scores.map(s=>`<span class="score-tag">${s.category} · ${s.subcategory}<b>+${s.score}</b></span>`).join('')||'<span class="score-tag">等待真实 Excel 数据接入</span>'}</div></article>`; }
function resetEventScroll(count){ clearInterval(eventTimer); if(count<2) return; eventTimer=setInterval(()=>{ if(hovering||!playing) return; const viewport=$('eventList').parentElement; const first=$('eventList').firstElementChild; const step=(first?.offsetHeight||95)+10; eventOffset=(eventOffset+1)%count; viewport.scrollTo({top:eventOffset*step,behavior:'smooth'}); },2700); }
function start(){ clearInterval(timer); if(!playing||hovering)return; timer=setInterval(()=>setMonth(currentIndex+1),120); }
function stop(){clearInterval(timer)}
function bind(){ $('prev').onclick=()=>{setMonth(currentIndex-1);}; $('next').onclick=()=>{setMonth(currentIndex+1);}; $('play').onclick=()=>{playing=!playing; $('play').textContent=playing?'Ⅱ':'▶'; playing?start():stop();}; $('timeline').oninput=e=>{setMonth(+e.target.value);}; }
(async function(){ await loadData(); $('dateRange').textContent=`（${fmtMonth(monthly[0].month)}–${fmtMonth(monthly.at(-1).month)}）`; $('timeline').max=monthly.length-1; bind(); initChart(); setMonth(0); start(); })();
