(function () {
  'use strict';

  const eventsRoot = document.getElementById('jjj-top-events');
  const activityData = window.EMBEDDED_ACTIVITY_DATA;
  const categoryNames = {
    '资源共享': '资源共享', '人才培养': '人才培养', '办学合作': '办学合作',
    '产教科教融合': '产教融合', '治理机制': '治理机制'
  };
  const topEvents = activityData.events
    .map(event => ({
      title: event.eventName,
      date: event.month,
      score: event.scores.reduce((sum, item) => sum + item.score, 0)
    }))
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
    .slice(0, 3)
    .map((event, index) => ({ ...event, rank: index + 1 }));

  eventsRoot.innerHTML = topEvents.map(item => `
    <article class="jjj-top-event" title="${item.title}">
      <span class="jjj-top-event__rank">TOP${item.rank}</span>
      <div>
        <span class="jjj-top-event__title">${item.title}</span>
        <div class="jjj-top-event__meta"><span>${item.date}</span></div>
      </div>
    </article>`).join('');
}());
