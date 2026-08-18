(function () {
  'use strict';

  const data = window.EMBEDDED_ACTIVITY_DATA;
  if (!data) return;

  // 逐项录入用户提供的“协同领域分类结果”Excel（Sheet1）统计值。
  // 保留事件数量排名前四的分类，其余四类合并展示为“其他”。
  const totals = [
    ['科技创新协同', 312, '#18baf3'], ['产业协同', 132, '#9068dd'],
    ['办学合作协同', 126, '#3eb576'], ['人才协同', 122, '#ff9410'],
    ['其他', 96 + 55 + 22 + 1, '#b7babd']
  ];
  const totalEvents = totals.reduce((sum, [, value]) => sum + value, 0);
  const chartData = totals.map(([name, value, color]) => ({ name, value, percent: value / totalEvents * 100, itemStyle: { color } }));

  const pieRoot = document.getElementById('jjj-category-pie');
  if (pieRoot && window.echarts) {
    const chart = window.echarts.init(pieRoot, null, { renderer: 'canvas' });
    chart.setOption({
      tooltip: { trigger: 'item', formatter: params => `${params.name}<br/>${params.data.value} 条事件（${params.data.percent.toFixed(2)}%）` },
      title: {
        text: '事件分类', left: '31%', top: '42%', textAlign: 'center',
        textStyle: { color: '#eff8ff', fontSize: 17, fontWeight: 700, lineHeight: 25 }
      },
      legend: {
        orient: 'vertical', right: 7, top: 'middle', itemWidth: 8, itemHeight: 8, itemGap: 8,
        textStyle: { color: '#c4ddec', fontSize: 10 },
        formatter: name => {
          const item = chartData.find(entry => entry.name === name);
          return `${name}  ${item.percent.toFixed(2)}%`;
        }
      },
      series: [{
        type: 'pie', radius: ['48%', '72%'], center: ['31%', '52%'], avoidLabelOverlap: true,
        itemStyle: { borderColor: '#0a203e', borderWidth: 3 }, label: { show: false }, data: chartData
      }]
    });
    new ResizeObserver(() => chart.resize()).observe(pieRoot);
  }

  const newsRoot = document.getElementById('jjj-news-ticker');
  if (newsRoot) {
    const recentNews = window.JJJ_NEWS_DATA;
    if (!Array.isArray(recentNews)) {
      newsRoot.textContent = '新闻数据加载失败';
      console.error('近期新闻数据未加载：window.JJJ_NEWS_DATA 不存在或格式无效。');
    } else {
      const latest = recentNews.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
      const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
      const itemHtml = news => {
        const url = String(news.url || '').trim();
        const validUrl = /^https?:\/\//i.test(url);
        const content = `<span class="jjj-news-item__tag">近期动态</span><div><strong>${escapeHtml(news.title)}</strong><small>${escapeHtml(news.date)}${news.source ? ` · ${escapeHtml(news.source)}` : ''}</small></div>`;
        return validUrl
          ? `<a class="jjj-news-item" title="${escapeHtml(news.title)}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${content}</a>`
          : `<article class="jjj-news-item jjj-news-item--disabled" title="${escapeHtml(news.title)}">${content}</article>`;
      };
      newsRoot.innerHTML = `<div class="jjj-news-ticker__track">${latest.map(itemHtml).join('')}${latest.map(itemHtml).join('')}</div>`;
      let position = 0;
      let paused = false;
      const track = newsRoot.firstElementChild;
      const step = () => {
        if (!paused && track) {
          position += 0.25;
          if (position >= track.scrollHeight / 2) position = 0;
          newsRoot.scrollTop = position;
        }
        requestAnimationFrame(step);
      };
      newsRoot.addEventListener('mouseenter', () => { paused = true; });
      newsRoot.addEventListener('mouseleave', () => { paused = false; });
      requestAnimationFrame(step);
    }
  }

  const cloudRoot = document.getElementById('jjj-keyword-cloud');
  if (cloudRoot) {
    // 在 Excel 的全部“新闻正文”中复核词频后保留的业务语义词；数值为正文出现次数。
    const words = [['创新',6912],['协同',5230],['科技',5187],['技术',3811],['教育',3776],['合作',3011],['人才',2912],['大学',2576],['协同发展',2252],['高校',1541],['学院',1313],['科技创新',1032],['科研',1008],['科技成果',941],['共建',868],['成果转化',847],['研发',800],['产业链',766],['创新中心',673],['研究院',590]];
    const palette = ['#21b3ed','#916ad8','#40b977','#ff9912','#ffd428','#ff694e','#50cdd3','#75a7c7'];
    const canvas = document.createElement('canvas');
    cloudRoot.replaceChildren(canvas);
    const drawCloud = () => {
      const rect = cloudRoot.getBoundingClientRect();
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio)); canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio); ctx.clearRect(0, 0, rect.width, rect.height);
      const max = words[0][1], min = words[words.length - 1][1], placed = [];
      words.forEach(([word, count], index) => {
        const size = 7 + 24 * Math.sqrt((count - min) / (max - min));
        ctx.font = `700 ${size}px Microsoft YaHei, PingFang SC, sans-serif`;
        const width = ctx.measureText(word).width, height = size * 1.05;
        let candidate = null;
        for (let attempt = 0; attempt < 8000 && !candidate; attempt += 1) {
          const angle = attempt * 0.51 + index * 0.7, radius = 1 + 1.15 * Math.sqrt(attempt);
          const x = rect.width / 2 + Math.cos(angle) * radius, y = rect.height / 2 + Math.sin(angle) * radius * .72;
          const box = { left: x - width / 2 - 1, right: x + width / 2 + 1, top: y - height / 2 - 1, bottom: y + height / 2 + 1 };
          const inside = box.left >= 2 && box.right <= rect.width - 2 && box.top >= 2 && box.bottom <= rect.height - 2;
          if (inside && !placed.some(other => !(box.right < other.box.left || box.left > other.box.right || box.bottom < other.box.top || box.top > other.box.bottom))) candidate = { x, y, box };
        }
        if (!candidate) return;
        placed.push({ ...candidate, word, size, color: palette[index % palette.length] });
      });
      if (placed.length) {
        const bounds = placed.reduce((result, item) => ({
          left: Math.min(result.left, item.box.left), right: Math.max(result.right, item.box.right),
          top: Math.min(result.top, item.box.top), bottom: Math.max(result.bottom, item.box.bottom)
        }), { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });
        const scale = Math.min(1.3, (rect.width - 8) / (bounds.right - bounds.left), (rect.height - 8) / (bounds.bottom - bounds.top));
        const offsetX = (rect.width - (bounds.right - bounds.left) * scale) / 2 - bounds.left * scale;
        const offsetY = (rect.height - (bounds.bottom - bounds.top) * scale) / 2 - bounds.top * scale;
        placed.forEach(item => {
          ctx.font = `700 ${item.size * scale}px Microsoft YaHei, PingFang SC, sans-serif`;
          ctx.fillStyle = item.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(item.word, item.x * scale + offsetX, item.y * scale + offsetY);
        });
      }
      cloudRoot.dataset.renderedWords = String(placed.length);
    };
    new ResizeObserver(drawCloud).observe(cloudRoot); drawCloud();
  }
}());
