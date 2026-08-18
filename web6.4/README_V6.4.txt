京津冀教育科技人才协同发展智能决策平台 V6.4
============================================================

一、本版本变更

1. 使用“合作网络网页制作/index_final.html”作为新的平台首页。
2. 完整继承 V6.3 的合作网络、资源地图、一体化分析、资源研究、
   AI 分析、决策支持和系统管理初版功能。
3. V6.3 文件未被修改，V6.4 为独立版本。

二、必须保留的目录结构

web6.4/
├─ index.html                  平台首页和栏目入口
├─ README_V6.4.txt            本说明文件
├─ modules/
│  └─ index.html              一体化分析、资源地图等功能模块
└─ network/
   ├─ index.html              合作网络页面
   └─ network_data.json       新闻事件、机构节点和合作关系数据

不要只发送 index.html。复制或发送给其他电脑时，应完整打包 web6.4
文件夹，并保持 modules 和 network 的相对目录不变。

三、推荐打开方式

在“合作网络网页制作”目录启动本地服务：

python -m http.server 8768

然后在浏览器访问：

http://127.0.0.1:8768/web6.4/

也可以直接双击 index.html；但部分浏览器可能限制本地文件读取，
因此推荐使用本地服务方式。资源地图使用在线地图资源，需要联网。

四、栏目对应关系

首页：首页新版设计。
协同监测：打开 network/index.html，对合作网络进行筛选和查看详情。
一体化分析：打开 modules/index.html#analysis。
资源地图：打开 modules/index.html#resources。
资源研究：打开 modules/index.html#research。
AI分析：打开 modules/index.html#ai。
决策支持：打开 modules/index.html#forecast。
系统管理：打开 modules/index.html#admin。

五、数据说明

V6.4 本次仅同步首页，没有重新爬取或替换新闻数据库。
合作网络及各模块继续使用 V6.3 原有数据。
