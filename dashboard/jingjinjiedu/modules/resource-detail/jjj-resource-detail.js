/**
 * jjj-resource-detail.js
 * 京津冀资源分布概览 — 地图 + 区域柱状图
 *
 * API:
 *   JjjResourceDetail.init(container, data, opts) → instance
 *   instance.update(data)
 *   instance.resize()
 *   instance.destroy()
 */

var JjjResourceDetail = (function () {
  "use strict";

  var COLORS = {
    "北京": "#ff8a1f", "天津": "#15b9e8", "河北": "#6fa94f"
  };
  var CATEGORY_COLORS = ["#1d87ff", "#29e5ff", "#25e4ae", "#ffe949", "#9a78ff", "#fa81ba"];

  var TIP = {
    backgroundColor: "rgba(4,20,55,.96)",
    borderColor: "rgba(46,182,255,.55)",
    borderWidth: 1,
    textStyle: { color: "#e9f8ff", fontSize: 12 }
  };

  /* helpers */
  function h(tag, cls, html) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }
  function fmt(n) {
    if (n == null) return "--";
    return n >= 10000 ? (n / 10000).toFixed(1) + "万" : n.toLocaleString("zh-CN");
  }
  function provColor(name, regions) {
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].name === name) return COLORS[regions[i].province] || "#1d87ff";
    }
    return "#1d87ff";
  }

  /* ==================== DOM ==================== */
  function buildDOM(root) {
    root.innerHTML = "";

    var header = h("header", "jjj-resource-detail__header");
    header.innerHTML =
      '<h2 class="jjj-resource-detail__title">京津冀三地资源分布概览 <small class="jjj-resource-detail__title-en">RESOURCE DISTRIBUTION</small></h2>' +
      '<div class="jjj-resource-detail__toolbar">' +
        '<select class="jjj-resource-detail__select" data-ctrl="year"></select>' +
        '<button class="jjj-resource-detail__btn" data-ctrl="back">← 返回</button>' +
      '</div>';

    var body = h("div", "jjj-resource-detail__body");

    // 左侧地图
    var mapZone = h("div", "jjj-resource-detail__map-zone");
    var tabsBar = h("div", "jjj-resource-detail__tabs-bar");
    tabsBar.setAttribute("data-role", "tabs");
    var mapWrap = h("div", "jjj-resource-detail__map-wrap");
    var mapChart = h("div", "jjj-resource-detail__map-chart");
    mapChart.setAttribute("data-chart", "map");
    mapWrap.appendChild(mapChart);
    mapZone.appendChild(tabsBar);
    mapZone.appendChild(mapWrap);

    // 右侧
    var side = h("aside", "jjj-resource-detail__side");
    side.innerHTML =
      '<div class="jjj-resource-detail__side-heading">' +
        '<div><label>区域选择</label><br><small>REGION SELECT</small></div>' +
        '<span data-role="current-region">点击地图选择区域</span>' +
      '</div>' +
      '<div class="jjj-resource-detail__indicator" data-role="indicator">' +
        '<span class="jjj-resource-detail__indicator-label">统计指标</span>' +
        '<span class="jjj-resource-detail__indicator-value" data-role="indicator-value"></span>' +
      '</div>' +
      '<div class="jjj-resource-detail__region-select-wrap">' +
        '<select class="jjj-resource-detail__region-select" data-ctrl="region"></select>' +
        '<span class="jjj-resource-detail__region-arrow"></span>' +
      '</div>' +
      '<div class="jjj-resource-detail__compare-title">同年度区域对比 <span data-role="unit"></span></div>' +
      '<div class="jjj-resource-detail__bar-chart" data-chart="bar"></div>';

    body.appendChild(mapZone);
    body.appendChild(side);

    root.appendChild(header);
    root.appendChild(body);

    return {
      root: root,
      yearSel: header.querySelector("[data-ctrl=year]"),
      backBtn: header.querySelector("[data-ctrl=back]"),
      tabsBar: tabsBar,
      mapChart: mapChart,
      regionSel: side.querySelector("[data-ctrl=region]"),
      currentRegion: side.querySelector("[data-role=current-region]"),
      indicatorValue: side.querySelector("[data-role=indicator-value]"),
      unitSpan: side.querySelector("[data-role=unit]"),
      barChart: side.querySelector("[data-chart=bar]")
    };
  }

  /* ==================== 状态 ==================== */
  function createState(data) {
    var cat0 = data.categories[0];
    return {
      year: data.currentYear || 2025,
      category: cat0.key,
      subCategory: cat0.subs ? cat0.subs[0].key : null,
      selectedRegion: data.regions[0].name
    };
  }

  /* 获取当前实际数据 key */
  function getDataKey(state, data) {
    if (state.subCategory) return state.subCategory;
    return state.category;
  }

  function getDataUnit(state, data) {
    if (state.subCategory) {
      for (var i = 0; i < data.categories.length; i++) {
        var cat = data.categories[i];
        if (cat.key === state.category && cat.subs) {
          for (var j = 0; j < cat.subs.length; j++) {
            if (cat.subs[j].key === state.subCategory) return cat.subs[j].unit || cat.unit;
          }
        }
      }
    }
    for (var i = 0; i < data.categories.length; i++) {
      if (data.categories[i].key === state.category) return data.categories[i].unit;
    }
    return "";
  }

  /* ==================== 统计指标说明 ==================== */
  var INDICATOR_MAP = {
    higherEd:         "各市普通高等学校数量",
    basicEd:          "各市中小学学校数量",
    researchPlatform: "各市省级重点实验室数量",
    teacher_primary:     "各市小学专任教师数",
    teacher_middle:      "各市初中专任教师数",
    teacher_high:        "各市高中专任教师数",
    teacher_vocational:  "各市中等职业学校专任教师数",
    teacher_higher:      "各市高等学校专任教师数",
    student_primary:     "各市小学在校学生数",
    student_middle:      "各市初中在校学生数",
    student_high:        "各市高中在校学生数",
    student_vocational:  "各市中等职业学校在校学生数",
    student_higher:      "各市高等学校在校学生数"
  };

  function updateIndicator(dom, state) {
    var key = state.subCategory || state.category;
    var text = INDICATOR_MAP[key] || "";
    if (dom.indicatorValue) dom.indicatorValue.textContent = text;
  }

  /* ==================== 下拉填充 ==================== */
  function fillYearSelect(sel, data) {
    sel.innerHTML = "";
    data.years.forEach(function (y) {
      var o = document.createElement("option");
      o.value = y;
      o.textContent = y + " 年";
      if (y === data.currentYear) o.selected = true;
      sel.appendChild(o);
    });
  }

  function fillRegionSelect(sel, data) {
    sel.innerHTML = "";
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = "全部区域汇总";
    sel.appendChild(o0);
    data.regions.forEach(function (r) {
      var o = document.createElement("option");
      o.value = r.name;
      o.textContent = r.name;
      sel.appendChild(o);
    });
  }

  /* ==================== 选项卡 ==================== */
  function renderTabs(bar, data, state) {
    bar.innerHTML = "";
    data.categories.forEach(function (cat) {
      if (cat.subs) {
        // 有子选项的 tab：按钮 + 下拉
        var wrap = h("span", "jjj-resource-detail__tab-wrap");
        var btn = h("button", "jjj-resource-detail__tab" + (cat.key === state.category ? " jjj-resource-detail__tab--active" : ""), cat.name);
        btn.setAttribute("data-cat", cat.key);
        wrap.appendChild(btn);
        var subSel = h("select", "jjj-resource-detail__sub-select");
        subSel.setAttribute("data-parent-cat", cat.key);
        cat.subs.forEach(function (sub) {
          var opt = document.createElement("option");
          opt.value = sub.key;
          opt.textContent = sub.name;
          if (sub.key === state.subCategory) opt.selected = true;
          subSel.appendChild(opt);
        });
        wrap.appendChild(subSel);
        bar.appendChild(wrap);
      } else {
        var btn = h("button", "jjj-resource-detail__tab" + (cat.key === state.category ? " jjj-resource-detail__tab--active" : ""), cat.name);
        btn.setAttribute("data-cat", cat.key);
        bar.appendChild(btn);
      }
    });
  }

  /* ==================== 地图 ==================== */
  var mapInst = null;

  function initMap(dom) {
    if (mapInst) { mapInst.dispose(); mapInst = null; }
    mapInst = echarts.init(dom.mapChart);
  }

  function renderMap(dom, data, state, geoJson) {
    if (!mapInst || !geoJson) return;

    echarts.registerMap("jjj", geoJson);

    var year = state.year;
    var cat = getDataKey(state, data);
    var unit = getDataUnit(state, data);

    // 地图着色数据
    var mapData = data.regions.map(function (r) {
      var v = (r.values[year] || {})[cat] || 0;
      return { name: r.name, value: v, province: r.province };
    });

    var maxVal = 1;
    mapData.forEach(function (d) { if (d.value > maxVal) maxVal = d.value; });

    // 选中区域样式
    var sel = state.selectedRegion;

    var option = {
      tooltip: Object.assign({}, TIP, {
        trigger: "item",
        formatter: function (p) {
          if (!p.data) return p.name;
          var d = p.data;
          var color = COLORS[d.province] || "#1d87ff";
          var catName = "";
          for (var ci = 0; ci < data.categories.length; ci++) {
            if (data.categories[ci].key === state.category) {
              if (data.categories[ci].subs) {
                for (var si = 0; si < data.categories[ci].subs.length; si++) {
                  if (data.categories[ci].subs[si].key === cat) { catName = data.categories[ci].subs[si].name; break; }
                }
              } else {
                catName = data.categories[ci].name;
              }
              break;
            }
          }
          return '<div style="font-weight:700;color:' + color + ';margin-bottom:4px">' + d.name + '</div>' +
            '<div>' + catName + '：<b>' + fmt(d.value) + '</b> ' + unit + '</div>';
        }
      }),
      visualMap: {
        min: 0,
        max: maxVal,
        left: 16,
        bottom: 16,
        text: ["高", "低"],
        textStyle: { color: "#80a9cd", fontSize: 10 },
        inRange: {
          color: ["rgba(8,50,100,0.6)", "rgba(29,135,255,0.8)"]
        },
        show: true,
        orient: "horizontal",
        itemWidth: 10,
        itemHeight: 80,
        calculable: false
      },
      geo: {
        map: "jjj",
        roam: true,
        zoom: 1.15,
        center: [115.8, 39.0],
        scaleLimit: { min: 0.8, max: 8 },
        itemStyle: {
          areaColor: "rgba(8,40,80,0.55)",
          borderColor: "rgba(0,168,255,0.4)",
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgba(0,120,255,0.4)",
            borderColor: "rgba(0,200,255,0.8)",
            borderWidth: 2,
            shadowColor: "rgba(0,168,255,0.5)",
            shadowBlur: 12
          },
          label: {
            show: true,
            color: "#f2f7ff",
            fontSize: 11,
            fontWeight: 600,
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowBlur: 3
          }
        },
        select: {
          itemStyle: {
            areaColor: "rgba(0,140,255,0.45)",
            borderColor: "rgba(0,220,255,0.9)",
            borderWidth: 2,
            shadowColor: "rgba(0,200,255,0.6)",
            shadowBlur: 15
          },
          label: { show: true, color: "#fff", fontSize: 11, fontWeight: 700 }
        },
        selectedMode: "single",
        label: { show: false },
        regions: []
      },
      series: [{
        type: "map",
        map: "jjj",
        geoIndex: 0,
        data: mapData
      }]
    };

    // 高亮选中
    if (sel) {
      var prov = "";
      for (var ri = 0; ri < data.regions.length; ri++) {
        if (data.regions[ri].name === sel) { prov = data.regions[ri].province; break; }
      }
      option.geo.regions = [{
        name: sel,
        itemStyle: {
          areaColor: COLORS[prov] || "#1d87ff",
          borderColor: "rgba(0,220,255,0.9)",
          borderWidth: 2,
          shadowColor: "rgba(0,200,255,0.5)",
          shadowBlur: 12
        },
        label: { show: true, color: "#fff", fontWeight: 700, fontSize: 11 }
      }];
    }

    mapInst.setOption(option, true);
  }

  /* ==================== 柱状图 ==================== */
  var barInst = null;

  function initBar(dom) {
    if (barInst) { barInst.dispose(); barInst = null; }
    barInst = echarts.init(dom.barChart);
  }

  function renderBar(dom, data, state) {
    if (!barInst) return;

    var year = state.year;
    var cat = getDataKey(state, data);
    var unit = getDataUnit(state, data);

    // 获取当前区域的同类别数据，按值排序
    var regs = data.regions.slice();
    regs.sort(function (a, b) {
      return ((b.values[year] || {})[cat] || 0) - ((a.values[year] || {})[cat] || 0);
    });

    var names = regs.map(function (r) { return r.name; });
    var values = regs.map(function (r) { return (r.values[year] || {})[cat] || 0; });
    var colors = regs.map(function (r) { return COLORS[r.province] || "#1d87ff"; });

    var sel = state.selectedRegion;
    var selIdx = -1;
    for (var si = 0; si < names.length; si++) {
      if (names[si] === sel) { selIdx = si; break; }
    }

    var catName = "";
    for (var ci = 0; ci < data.categories.length; ci++) {
      if (data.categories[ci].key === state.category) {
        if (data.categories[ci].subs) {
          for (var si = 0; si < data.categories[ci].subs.length; si++) {
            if (data.categories[ci].subs[si].key === cat) { catName = data.categories[ci].subs[si].name; break; }
          }
        } else {
          catName = data.categories[ci].name;
        }
        break;
      }
    }

    dom.unitSpan.textContent = unit;

    var option = {
      tooltip: Object.assign({}, TIP, {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          var p = params[0];
          if (!p) return "";
          var idx = p.dataIndex;
          var color = colors[idx];
          return '<div style="font-weight:700;color:' + color + '">' + names[idx] + '</div>' +
            '<div>' + catName + '：<b>' + fmt(values[idx]) + '</b> ' + unit + '</div>';
        }
      }),
      grid: { left: 72, right: 36, top: 10, bottom: 24 },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(80,130,170,.18)" } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#80a9cd", fontSize: 10, formatter: function (v) { return v >= 10000 ? (v / 10000) + "万" : v; } }
      },
      yAxis: {
        type: "category",
        data: names,
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: function (value) {
            for (var i = 0; i < names.length; i++) {
              if (names[i] === value) {
                return (selIdx === i) ? "#fff" : "#8db8dc";
              }
            }
            return "#8db8dc";
          },
          fontSize: 11,
          fontWeight: function (value) {
            return value === sel ? "bold" : "normal";
          }
        }
      },
      series: [{
        type: "bar",
        data: values.map(function (v, i) {
          var isSelected = (selIdx === i);
          return {
            value: v,
            itemStyle: {
              color: isSelected
                ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: colors[i] },
                    { offset: 1, color: colors[i] + "66" }
                  ])
                : colors[i] + "99",
              borderRadius: [0, 3, 3, 0]
            }
          };
        }),
        barWidth: 16,
        label: {
          show: true,
          position: "right",
          formatter: function (p) { return fmt(p.value); },
          color: "#b8d8f0",
          fontSize: 10
        }
      }]
    };

    barInst.setOption(option, true);
  }

  /* ==================== 全量渲染 ==================== */
  function renderAll(dom, data, state, geoJson) {
    updateIndicator(dom, state);
    renderMap(dom, data, state, geoJson);
    renderBar(dom, data, state);
  }

  /* ==================== 事件 ==================== */
  function bindEvents(dom, getState, dataRef, geoRef, opts) {
    var off = [];

    function on(el, ev, fn) {
      el.addEventListener(ev, fn);
      off.push({ el: el, ev: ev, fn: fn });
    }

    // 年度
    on(dom.yearSel, "change", function () {
      var s = getState();
      s.year = parseInt(this.value, 10);
      renderAll(dom, dataRef(), s, geoRef());
      if (opts.onFilterChange) opts.onFilterChange({ year: s.year, category: s.category });
    });

    // 选项卡
    on(dom.tabsBar, "click", function (e) {
      var btn = e.target.closest("[data-cat]");
      if (!btn) return;
      var s = getState();
      var newCat = btn.getAttribute("data-cat");
      s.category = newCat;
      var data = dataRef();
      for (var ci = 0; ci < data.categories.length; ci++) {
        if (data.categories[ci].key === newCat && data.categories[ci].subs) {
          s.subCategory = data.categories[ci].subs[0].key;
          break;
        }
        if (data.categories[ci].key === newCat && !data.categories[ci].subs) {
          s.subCategory = null;
          break;
        }
      }
      renderAll(dom, data, s, geoRef());
      if (opts.onFilterChange) opts.onFilterChange({ year: s.year, category: s.category, subCategory: s.subCategory });
    });

    // 子选项下拉
    on(dom.tabsBar, "change", function (e) {
      var sel = e.target.closest("[data-parent-cat]");
      if (!sel) return;
      var s = getState();
      s.category = sel.getAttribute("data-parent-cat");
      s.subCategory = sel.value;
      renderAll(dom, dataRef(), s, geoRef());
      if (opts.onFilterChange) opts.onFilterChange({ year: s.year, category: s.category, subCategory: s.subCategory });
    });

    // 区域下拉
    on(dom.regionSel, "change", function () {
      var s = getState();
      s.selectedRegion = this.value || dataRef().regions[0].name;
      renderAll(dom, dataRef(), s, geoRef());
    });

    // 地图点击
    if (mapInst) {
      mapInst.on("click", function (p) {
        if (p.seriesType === "map" && p.name) {
          var s = getState();
          s.selectedRegion = p.name;
          dom.regionSel.value = p.name;
          dom.currentRegion.textContent = p.name;
          renderAll(dom, dataRef(), s, geoRef());
        }
      });
    }

    // 返回
    on(dom.backBtn, "click", function () {
      if (opts.onBack) opts.onBack();
    });

    return function () {
      off.forEach(function (h) { h.el.removeEventListener(h.ev, h.fn); });
      off.length = 0;
    };
  }

  /* ==================== ResizeObserver ==================== */
  function setupResize(dom) {
    var obs = new ResizeObserver(function () {
      if (mapInst) mapInst.resize();
      if (barInst) barInst.resize();
    });
    obs.observe(dom.mapChart);
    obs.observe(dom.barChart);
    return obs;
  }

  /* ==================== 生命周期 ==================== */
  function init(container, data, opts) {
    opts = opts || {};
    var dom = buildDOM(container);
    var state = createState(data);
    var geoData = null;
    var dataRef = data;
    var unbind = null;
    var resizeObs = null;

    fillYearSelect(dom.yearSel, data);
    fillRegionSelect(dom.regionSel, data);
    renderTabs(dom.tabsBar, data, state);

    initMap(dom);
    initBar(dom);

    dom.currentRegion.textContent = state.selectedRegion;

    // 加载 GeoJSON
    if (typeof JjjGeoData !== "undefined" && JjjGeoData.fetchGeoJson) {
      JjjGeoData.fetchGeoJson().then(function (geo) {
        geoData = geo;
        renderAll(dom, dataRef, state, geoData);
        if (mapInst) mapInst.resize();
        if (barInst) barInst.resize();
        unbind = bindEvents(dom, function () { return state; }, function () { return dataRef; }, function () { return geoData; }, opts);
      }).catch(function (err) {
        console.error("[jjj] GeoJSON error:", err);
        if (JjjGeoData.buildFallback) geoData = JjjGeoData.buildFallback();
        renderAll(dom, dataRef, state, geoData);
        unbind = bindEvents(dom, function () { return state; }, function () { return dataRef; }, function () { return geoData; }, opts);
      });
    } else {
      renderAll(dom, dataRef, state, null);
      unbind = bindEvents(dom, function () { return state; }, function () { return dataRef; }, function () { return geoData; }, opts);
    }

    resizeObs = setupResize(dom);

    return {
      update: function (newData) {
        dataRef = newData;
        fillYearSelect(dom.yearSel, newData);
        fillRegionSelect(dom.regionSel, newData);
        renderTabs(dom.tabsBar, newData, state);
        renderAll(dom, dataRef, state, geoData);
      },
      resize: function () {
        if (mapInst) mapInst.resize();
        if (barInst) barInst.resize();
      },
      destroy: function () {
        if (unbind) unbind();
        if (resizeObs) resizeObs.disconnect();
        if (mapInst) { mapInst.dispose(); mapInst = null; }
        if (barInst) { barInst.dispose(); barInst = null; }
        container.innerHTML = "";
      }
    };
  }

  return { init: init };
})();
