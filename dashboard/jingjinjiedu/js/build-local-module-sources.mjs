import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'github_upload_workspace', '最终版网页_分板块', '框架');
const files = [
  'modules/activity-index/index.html','modules/activity-index/active-index.css','modules/activity-index/active-index.data.js','modules/activity-index/active-index.js',
  'modules/activity-share/index.html','modules/important-events/index.html','modules/important-events/important-events-data.js',
  'modules/education-index/index.html','modules/network/index.html','modules/network/collaboration-network.css','modules/network/collaboration-network-theme.css','modules/network/collaboration-network.js','modules/network/network_data.json',
  'modules/coordination-index/index.html','modules/coordination-index/css/variables.css','modules/coordination-index/css/reset.css','modules/coordination-index/css/panels.css','modules/coordination-index/assets/echarts.min.js','modules/coordination-index/js/module-loader.js','modules/coordination-index/data/coordination-index-data.js','modules/coordination-index/modules/coordination-index/coordination-index.css','modules/coordination-index/modules/coordination-index/coordination-index.js',
  'modules/stage-share/index.html','modules/stage-share/stage-share.css','modules/stage-share/stage-share.js','modules/stage-share/stage-share-data.js','modules/resource-overview/index.html','modules/resource-detail/index.html','modules/resource-detail/jjj-resource-detail.css','modules/resource-detail/jjj-resource-detail.js','modules/resource-detail/data/jjj-resource-detail.mock.js','modules/resource-detail/data/geo/boundaries-embedded.js','modules/resource-detail/data/geo/jjj-geo-data.js','modules/resource-detail/data/geo/jjj-boundaries.json','modules/vendor/echarts.min.js'
];
const entries = await Promise.all(files.map(async file => [file, await readFile(resolve(root, file), 'utf8')]));
await writeFile(resolve(root, 'js/local-module-sources.js'), `window.LOCAL_MODULE_SOURCES=${JSON.stringify(Object.fromEntries(entries))};\n`, 'utf8');
