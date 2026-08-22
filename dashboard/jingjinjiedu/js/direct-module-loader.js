(() => {
  'use strict';

  const modules = [
    ['module-activity-index', 'modules/activity-index/index.html'],
    ['module-activity-share', 'modules/activity-share/index.html'],
    ['module-important-events', 'modules/important-events/index.html'],
    ['module-education-index', 'modules/education-index/index.html'],
    ['module-cooperation-network', 'modules/network/index.html'],
    ['module-coordination-index', 'modules/coordination-index/index.html'],
    ['module-stage-share', 'modules/stage-share/index.html'],
    ['module-resource-overview', 'modules/resource-overview/index.html'],
    ['module-resource-detail', 'modules/resource-detail/index.html']
  ];

  // 模块既可能来自已发布页面，也可能来自本仓库的相对路径。
  // 先把模块页面自身解析为绝对地址，再解析其脚本、样式和数据地址。
  const absolute = (value, base) => new URL(value, new URL(base, document.baseURI)).href;
  const bundledKey = (value, base) => {
    const path = decodeURIComponent(new URL(value, new URL(base, document.baseURI)).pathname).replace(/\\/g, '/');
    const marker = '/modules/';
    const index = path.indexOf(marker);
    return index < 0 ? null : `modules/${path.slice(index + marker.length)}`;
  };
  const bundledText = (value, base) => {
    const key = bundledKey(value, base);
    return key && window.LOCAL_MODULE_SOURCES ? window.LOCAL_MODULE_SOURCES[key] : null;
  };
  const cleanCss = css => css.replace(/(^|})\s*(html\s*,\s*)?body\s*\{[^}]*\}/g, '$1');
  const prepareCss = (css, targetId) => {
    let value = cleanCss(css);
    if (targetId === 'module-coordination-index') {
      const scope = '#module-coordination-index';
      value = value.replace(/\.panel\b/g, `${scope} .panel`)
        .replace(/(^|})\s*h1\b/g, `$1${scope} h1`)
        .replace(/\.content\b/g, `${scope} .content`)
        .replace(/\.tabs\b/g, `${scope} .tabs`)
        .replace(/\.tab\b/g, `${scope} .tab`)
        .replace(/\.progress\b/g, `${scope} .progress`)
        .replace(/#chart\b/g, `${scope} #chart`);
    }
    return value;
  };

  async function runScript(source, base) {
    const script = document.createElement('script');
    if (source.src) {
      const sourcePath = source.getAttribute('src');
      // 该预览页引用的旧新闻数据路径已不存在；前一份专用事件数据已覆盖所需内容。
      if (sourcePath === '../dashboard/data/news-data.js') return;
      script.src = absolute(sourcePath, base);
      let localCode = bundledText(sourcePath, base);
      if (localCode != null) {
        if (sourcePath.endsWith('important-events-data.js')) localCode = localCode.replace(
          'http://epaper.tianjinwe.com/tjrb/html/2026-04/25/content_157780_1780661.htm',
          'https://epaper.tianjinwe.com/tjrb/resfile/2026-04-25/04/04.pdf'
        );
        if (sourcePath.endsWith('active-index.js')) localCode = localCode.replace(/left:\s*'8%',\s*right:\s*'5%',\s*top:\s*'8%',\s*bottom:\s*'14%'/, "left: '3%', right: '2%', top: '18%', bottom: '10%'");
        if (sourcePath.endsWith('jjj-geo-data.js')) localCode = localCode.replace(
          /fetch\("data\/geo\/jjj-boundaries\.json"\)/g,
          "Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(window.LOCAL_MODULE_SOURCES['modules/resource-detail/data/geo/jjj-boundaries.json']))})"
        );
        script.removeAttribute('src');
        script.textContent = localCode;
        document.body.append(script);
        return;
      }
      if (script.src.includes('cdn.jsdelivr.net/npm/echarts')) {
        script.removeAttribute('src');
        script.textContent = window.LOCAL_MODULE_SOURCES['modules/vendor/echarts.min.js'];
        document.body.append(script);
        return;
      }
      // 活跃度模块在总屏中有更充足的下方空间：横向扩展绘图区，
      // 并给页签和指标卡预留上方空间，避免与曲线重叠。
      if (sourcePath.endsWith('active-index.js')) {
        const code = await fetch(script.src).then(response => {
          if (!response.ok) throw new Error(`脚本加载失败（${response.status}）`);
          return response.text();
        });
        script.removeAttribute('src');
        script.textContent = code.replace(
          /left:\s*'8%',\s*right:\s*'5%',\s*top:\s*'8%',\s*bottom:\s*'14%'/,
          "left: '3%', right: '2%', top: '18%', bottom: '10%'"
        );
        document.body.append(script);
        return;
      }
      script.async = false;
      await new Promise((resolve, reject) => {
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', reject, { once: true });
        document.head.append(script);
      });
      return;
    }
    let code = source.textContent;
    // 网络模块在原页面中以自身目录为基准取数；直接挂载后需保留该基准。
    code = code.replace(/fetch\('\.\/network_data\.json'\)/g, "Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(window.LOCAL_MODULE_SOURCES['modules/network/network_data.json']))})");
    code = code.replace(/fetch\("data\/geo\/jjj-boundaries\.json"\)/g, "Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(window.LOCAL_MODULE_SOURCES['modules/resource-detail/data/geo/jjj-boundaries.json']))})");
    // 资源详情在总框架中使用时，返回按钮回到本总网页。
    if (base.includes('modules/resource-detail')) {
      code = code.replace(
        'console.log("[detail] back");',
        'window.closeResourceDetail();'
      );
    }
    script.textContent = code;
    document.body.append(script);
  }

  async function mount(targetId, url) {
    const target = document.getElementById(targetId);
    if (!target) return;
    try {
      const localSource = window.LOCAL_MODULE_SOURCES && window.LOCAL_MODULE_SOURCES[url];
      let sourceText = localSource != null ? localSource : await fetch(url).then(response => {
        if (!response.ok) throw new Error(`加载失败（${response.status}）`);
        return response.text();
      });
      if (url === 'modules/resource-overview/index.html') {
        sourceText = sourceText
          .replace('values: [1600, 1300, 17000]', 'values: [1401, 1438, 14471]')
          .replace('values: [100, 20, 8]', 'values: [145, 29, 8]');
      }
      const source = new DOMParser().parseFromString(sourceText, 'text/html');
      const scripts = [...source.querySelectorAll('script')];
      scripts.forEach(script => script.remove());

      source.querySelectorAll('style').forEach(style => {
        const copy = document.createElement('style');
        copy.textContent = prepareCss(style.textContent, targetId);
        document.head.append(copy);
      });
      source.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const localCss = bundledText(link.getAttribute('href'), url);
        if (localCss != null) {
          const copy = document.createElement('style');
          copy.textContent = prepareCss(localCss, targetId);
          document.head.append(copy);
          return;
        }
        const copy = document.createElement('link');
        copy.rel = 'stylesheet';
        copy.href = absolute(link.getAttribute('href'), url);
        document.head.append(copy);
      });

      source.querySelectorAll('.test-controls,.test-size-label,.test-bar').forEach(node => node.remove());
      while (source.body.firstChild) target.append(source.body.firstChild);
      for (const script of scripts) await runScript(script, url);
      // 重要事件页面的初始化原本等待独立页面的 DOMContentLoaded；
      // 直接挂载时该事件已经触发，需要在资源就绪后立即初始化。
      if (targetId === 'module-important-events' && window.ImportantEventsModule) {
        window.ImportantEventsModule.init(
          target.querySelector('#important-events-root'),
          window.JJJ_IMPORTANT_EVENTS_2026 || window.JJJ_NEWS_DATA || []
        );
      }
    } catch (error) {
      target.innerHTML = `<div class="panel-placeholder">模块加载失败<small>${error.message}</small></div>`;
      console.error(`无法加载 ${targetId}`, error);
    }
  }

  modules.reduce((chain, [id, url]) => chain.then(() => mount(id, url)), Promise.resolve());
})();
