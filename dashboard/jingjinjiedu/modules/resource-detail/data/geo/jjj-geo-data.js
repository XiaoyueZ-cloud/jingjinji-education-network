/**
 * jjj-geo-data.js
 * 京津冀 GeoJSON — 从本地文件加载，不依赖外部 API
 */

(function (root) {
  "use strict";

  function fetchJjjGeoJson() {
    if (root.JJJ_BOUNDARIES) return Promise.resolve(root.JJJ_BOUNDARIES);
    return fetch("data/geo/jjj-boundaries.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.error("[jjj-geo] Local file load failed:", err);
        return buildFallbackGeoJson();
      });
  }

  function buildFallbackGeoJson() {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "北京市", province: "北京" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [115.42, 40.55], [115.97, 40.55], [116.10, 40.70],
              [116.60, 40.85], [117.15, 40.65], [117.40, 40.30],
              [117.12, 40.14], [116.85, 39.95], [116.65, 39.90],
              [116.65, 39.65], [116.35, 39.55], [116.10, 39.55],
              [115.75, 39.70], [115.42, 39.85], [115.42, 40.55]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "天津市", province: "天津" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [116.70, 39.65], [116.85, 39.55], [117.05, 39.60],
              [117.25, 39.65], [117.50, 39.60], [117.80, 39.50],
              [117.95, 39.25], [117.85, 38.95], [117.45, 38.70],
              [117.20, 38.60], [116.90, 38.75], [116.75, 38.95],
              [116.70, 39.20], [116.70, 39.65]
            ]]
          }
        }
      ]
    };
  }

  root.JjjGeoData = {
    fetchGeoJson: fetchJjjGeoJson,
    buildFallback: buildFallbackGeoJson
  };

})(window);
