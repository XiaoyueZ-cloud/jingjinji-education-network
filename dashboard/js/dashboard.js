(function () {
  'use strict';

  const data = window.DashboardData;
  const eventsRoot = document.getElementById('jjj-top-events');
  const activityData = window.EMBEDDED_ACTIVITY_DATA;
  const kpiRoot = document.getElementById('jjj-kpi-grid');
  const icons = {
    index: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l11 11-11 11L13 15zM11 17l10 10-10 10L1 27zM37 17l10 10-10 10-10-10zM24 28l11 11-11 11-11-11z"/></svg>`,
    events: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 3h18l8 8v34H12zM30 3v10h10M18 20h14M18 27h14M18 34h10"/><path d="M7 10v34h24"/></svg>`,
    subjects: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="14" r="7"/><circle cx="10" cy="20" r="5"/><circle cx="38" cy="20" r="5"/><path d="M12 42v-5c0-6 5-10 12-10s12 4 12 10v5M1 42v-4c0-5 4-8 9-8M47 42v-4c0-5-4-8-9-8"/></svg>`,
    relations: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="9" cy="37" r="5"/><circle cx="24" cy="18" r="5"/><circle cx="40" cy="7" r="5"/><circle cx="40" cy="39" r="5"/><path d="M13 34l8-12M28 16l8-6M28 20l8 16M14 38h21"/></svg>`
  };
  const categoryNames = {
    '资源共享': '资源共享', '人才培养': '人才培养', '办学合作': '办学合作',
    '产教科教融合': '产教融合', '治理机制': '治理机制'
  };
  const topEvents = activityData.events
    .filter(event => event.month.startsWith('2026-'))
    .map(event => ({
      title: event.eventName,
      date: event.month,
      score: event.scores.reduce((sum, item) => sum + item.score, 0)
    }))
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
    .slice(0, 3)
    .map((event, index) => ({ ...event, rank: index + 1 }));
  const cleanTitle = value => String(value).replace(/[\s，、。；：！？“”‘’（）()《》\-—]/g, '');
  const findNewsUrl = title => {
    const target = cleanTitle(title);
    const match = (window.JJJ_NEWS_DATA || []).find(news => {
      const candidate = cleanTitle(news.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    });
    return /^https?:\/\//i.test(String(match?.url || '')) ? match.url : '';
  };

  eventsRoot.innerHTML = topEvents.map(item => `
    ${findNewsUrl(item.title) ? `<a class="jjj-top-event" title="${item.title}" href="${findNewsUrl(item.title)}" target="_blank" rel="noopener noreferrer">` : `<article class="jjj-top-event" title="${item.title}">`}
      <span class="jjj-top-event__rank">TOP${item.rank}</span>
      <div>
        <span class="jjj-top-event__title">${item.title}</span>
        <div class="jjj-top-event__meta"><span>${item.date}</span></div>
      </div>
    ${findNewsUrl(item.title) ? '</a>' : '</article>'}`).join('');

  kpiRoot.innerHTML = data.kpiCards.map(card => {
    if (card.type === 'regions') {
      return `<article class="jjj-kpi-card jjj-kpi-card--regions"><div class="jjj-kpi-card__ring"></div><div><h2>${card.label}</h2><div class="jjj-kpi-card__regions">${card.regions.map(([name, value]) => `<span><b>${name}</b>${value}</span>`).join('')}</div></div></article>`;
    }
    const trend = card.trend ? `<svg class="jjj-kpi-card__trend" viewBox="0 0 120 24" aria-hidden="true"><polyline points="0,17 40,20 80,7 120,5"/></svg>` : '';
    const delta = card.delta ? `<span class="jjj-kpi-card__delta${card.direction === 'down' ? ' is-down' : ''}">${card.direction === 'down' ? '↓' : '↑'} ${card.delta}</span>` : '';
    const subMetric = card.subValue ? `<p class="jjj-kpi-card__submetric">${card.subLabel}<strong>${card.subValue}</strong></p>` : '';
    const note = card.note ? `<p>${card.note}${delta}</p>` : '';
    return `<article class="jjj-kpi-card jjj-kpi-card--${card.type}"><div class="jjj-kpi-card__icon">${icons[card.type]}</div><div class="jjj-kpi-card__body"><h2>${card.label}</h2><div class="jjj-kpi-card__value">${card.value}</div>${note}${subMetric}${trend}</div></article>`;
  }).join('');
}());
