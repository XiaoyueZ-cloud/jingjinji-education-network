(function () {
  'use strict';
  const source = window.EMBEDDED_ACTIVITY_DATA;
  if (!source || !window.echarts) return;

  const categories = ['资源共享', '人才培养', '办学合作', '产教科教融合', '治理机制'];
  const colors = { 资源共享: '#44d5ff', 人才培养: '#8b8cff', 办学合作: '#f7b84b', 产教科教融合: '#4ee6ad', 治理机制: '#f477b8' };
  const monthly = source.monthly;
  const events = source.events;
  const chartDom = document.getElementById('activity-timeline-chart');
  const rangeDom = document.getElementById('activity-timeline-range');
  const monthDom = document.getElementById('activity-timeline-month');
  const slider = document.getElementById('activity-timeline-slider');
  const labelDom = document.getElementById('activity-timeline-label');
  const structureDom = document.getElementById('activity-timeline-structure-month');
  const barsDom = document.getElementById('activity-timeline-bars');
  const eventsDom = document.getElementById('activity-timeline-events');
  const eventCountDom = document.getElementById('activity-timeline-event-count');
  let index = 0, playing = true, timer, chart, observer;

  const formatMonth = value => `${value.slice(0, 4)}年${value.slice(5)}月`;
  function renderChart() {
    chart.setOption({
      animationDuration: 160,
      grid: { left: 42, right: 15, top: 18, bottom: 25 },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(2,20,48,.96)', borderColor: '#2a6b96', textStyle: { color: '#eaf4ff' } },
      xAxis: { type: 'category', data: monthly.map(item => item.month), axisLabel: { color: '#87a8c1', fontSize: 9, interval: 5, formatter: value => value.slice(2) }, axisLine: { lineStyle: { color: '#4e7696' } }, axisTick: { show: false } },
      yAxis: { type: 'value', axisLabel: { color: '#87a8c1', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(78,118,150,.18)' } } },
      series: [{
        type: 'line', name: '月度总活跃度', data: monthly.map(item => item.total), smooth: true, symbolSize: 5,
        lineStyle: { color: '#56d8ff', width: 2 }, itemStyle: { color: '#56d8ff' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(44, 173, 255, .35)' }, { offset: 1, color: 'rgba(8, 53, 120, .03)' }]) },
        markPoint: { symbolSize: 0, data: [{ coord: [monthly[index].month, monthly[index].total], label: { show: true, formatter: monthly[index].total.toFixed(1), color: '#fff', backgroundColor: '#168ac0', padding: [3, 5], borderRadius: 3 } }] }
      }]
    }, { notMerge: true });
  }
  function renderMonth() {
    const row = monthly[index];
    monthDom.textContent = formatMonth(row.month); labelDom.textContent = row.month; structureDom.textContent = `${formatMonth(row.month)} · 五维结构`; slider.value = index;
    const max = Math.max(...categories.map(category => row.categories[category]));
    barsDom.innerHTML = categories.map(category => `<div class="jjj-activity-timeline__bar"><span>${category === '产教科教融合' ? '产教融合' : category}</span><i><b style="width:${max ? row.categories[category] / max * 100 : 0}%;background:${colors[category]}"></b></i><em>${row.categories[category].toFixed(1)}</em></div>`).join('');
    const currentEvents = events.filter(event => event.month === row.month);
    eventCountDom.textContent = `${currentEvents.length} 条`;
    eventsDom.innerHTML = (currentEvents.length ? currentEvents : [{ eventName: '本月暂无可展示的协同事件', subject: '—' }]).map(event => `<article class="jjj-activity-timeline__event"><strong title="${event.eventName}">${event.eventName}</strong><span>${event.subject || '—'}</span></article>`).join('');
    renderChart();
  }
  function stop() { clearInterval(timer); }
  function start() { stop(); if (playing) timer = setInterval(() => { index = (index + 1) % monthly.length; renderMonth(); }, 850); }
  function init() {
    rangeDom.textContent = `（${formatMonth(monthly[0].month)}–${formatMonth(monthly.at(-1).month)}）`;
    slider.max = monthly.length - 1;
    chart = echarts.init(chartDom);
    window.DashboardCharts = window.DashboardCharts || {}; window.DashboardCharts.activityTimeline = chart;
    observer = new ResizeObserver(() => chart.resize()); observer.observe(chartDom);
    chart.on('click', params => { if (params.dataIndex != null) { index = params.dataIndex; renderMonth(); } });
    chart.on('mouseover', () => stop()); chart.on('mouseout', () => start());
    document.getElementById('activity-timeline-prev').onclick = () => { index = (index - 1 + monthly.length) % monthly.length; renderMonth(); };
    document.getElementById('activity-timeline-next').onclick = () => { index = (index + 1) % monthly.length; renderMonth(); };
    document.getElementById('activity-timeline-play').onclick = event => { playing = !playing; event.currentTarget.textContent = playing ? 'Ⅱ' : '▶'; start(); };
    slider.oninput = event => { index = Number(event.target.value); renderMonth(); };
    renderMonth(); start();
  }
  window.DashboardModules = window.DashboardModules || {}; window.DashboardModules.initActivityTimeline = init;
  init();
}());
