# Mixtream

A stream mixer for online contests invigilation.

提供简单的Web界面，便于进行直播流的云端混流，在线监看。仅支持腾讯云直播。

这个App是短时间内为应付某线上比赛监考需求的产物，有很多不完美的地方（严重的设计缺陷）。如果你需要使用此App进行监考（可怜的孩子），欢迎提Issue或以其他方式与我们联系。

## 值得一提

- 所有的逻辑（调用腾讯的API查询流状态，创建/删除混流）本来可以完全运行在用户的浏览器上。
但由于腾讯云的API不支持跨域请求、提供的Node.js SDK也必需Node.js环境，所以这个App做成了前后端分离的样子。
所有对腾讯云API的请求都将发回后端，在服务器上调用API。

- 这是一个标准的`Next.js`程序，前端的几个页面和使用到的组件均在`pages/`目录中。"后端"并非单独的程序，而是使用了`Next.js`的`API Routing`功能。
所有的后端代码均在`pages/api/`目录中。前端使用`react-query`获取后端数据，相应代码在`api/`目录中。使用这一库的主要目的是进行缓存（记录下所有的输入流信息，他们大概不会变动）与自动`refetch`（每隔一段时间重新或许流状态，以实时显示直播流是否正常推流中）。

- 获取实时流状态的方法简单粗暴，即每隔一段时间（10s）poll一次后端API，在由后端服务查询腾讯云提供的API，获取结果后返回前端。这种方法保证很好的实时性，在流很多时，可能会对网络造成拥堵。
使用Websocket之类的协议应该是更好的选择。

- 在直播开始推流或断流时，使用`react-hot-toast`弹出提示。在实际应用中，使用的是`alert()`。`alert()`需要用户手动关闭，且会弹出全屏下的播放器，而`react-hot-toast`不会有这个特点。

- 由于腾讯云没有提供"查询当前的所有混流信息"这一功能，此App不得不自行维护添加/删除混流信息。后端会使用`node-json-db`连接到一个`json`文件进行数据记录。

- 由于有修改本地文件的需求（`db.json`），此App无法使用Serverless的方式部署。

- 使用了UI库`Material UI`。这是由于作者最熟悉，是为了赶时间而做的选择。

- 此App存在鉴权（Authentication）的需求，使用了`jwt`来解决。前端需要从后端获取`jwt`后，并附在之后请求的`Header`中。