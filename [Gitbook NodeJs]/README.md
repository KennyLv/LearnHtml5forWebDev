# About NodeJs

> **转载自http://www.cnblogs.com/luics/ ，新浪微博@徐凯-鬼道**

学习node的过程很美妙，不断有新的概念出现；这个过程也大大拓展了技术视野，之后会把学习中遇到的点点滴滴整理出来。

## Node是什么？


“Node.js”是官方称呼，交流多用node简称。

Ryan Dahl给Chrome V8 Javascript引擎添加了一组友好的Javascript API，并让V8能够独立运行于多个平台上（暂且把V8看做是js虚拟机），这样js也能写出跨平台非浏览器页面的应用。

关于node是什么？[github上node项目](https://github.com/joyent/node)的readme标题为“Evented I/O for V8 Javascript”，也能看出node给自己的定位； 下面是一小段node代码，实现了一个简单http server：
```
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```
node本身只提供实现应用程序的[精简api集合](http://nodejs.org/api/)。为了让node能提供更强大的功能，Ryan借鉴了Perl、Python等语言的经验，提出了NPM（Node Packaged Module，暂且叫模块）的概念，并创建了一整套的模块发布、安装、依赖管理机制；node后来的成功，也是所有node社区成员共同努力的结果，NPM起了关键的作用。

更多node介绍可查看[这里](http://nodejs.org/about/)。

## Node为何成功？

node最初的宣传“噱头”是单线程异步编程模型；单线程意味着编程复杂性更容易控制；node事件驱动的异步编程模型实现的非阻塞IO，可以编写出更高并发量的网络程序（如web server）；对某些特定应用场景是非常有吸引力的，比如Twitter的tweet处理队列，其他应用场景包括：RESTFUL API、实时数据统计；总的来说，高并发小数据量的场景比较适合node。

不可否认node概念新颖，初期尤其对前端工程师吸引力巨大，因为不需要花费太大代价就能实现浏览器之外的相当丰富的功能；从[NPM Registry](https://npmjs.org)也能看出来，早期的项目以前端为主。

node发展飞快，随着node名声鹊起，也吸引了更多非前端程序员的加入，我们看到了诸如关系数据库、no-sql、MVC framework 等类型更为丰富的模块出现了。

node发展过程获得了node社区的大力支持，从NPM Registry站点的火热程度可见一斑；截止2012-11-17已有17700+模块，目前仍然在持续增长中（后续会专门介绍NPM）。

这些因素一起推动了node在数年内就风靡全球。



## Node资源

现在安装node变得很简单，支持多个平台；

**API文档**：

[官方](http://nodejs.org/api/) [第三方](http://nodemanual.org/latest/) [NPM](https://npmjs.org)

**入门书籍，好书不在多**

《[NodeJs Beginner](https://github.com/ManuelKiessling/NodeBeginnerBook/)》[中文版](http://www.nodebeginner.org/index-zh-cn.html)，开源node教程；实现了一个完整精悍的Web应用，包含：server、router、handler
《[Node for Front End Developers](http://www.amazon.cn/Node-for-Front-End-Developers-Means-Garann/dp/1449318835)》，简练而较全面地介绍了node的网络、数据、MVC等方面的原生技术和第三方模块

更多的资源可以访问nodejs.org

**Git & Github**

进入node的世界，git成了最常见的源码管理工具；希望多了解git，可以参考开源git教程《ProGit》。

github是目前最火的git远程库托管中心；github制作之精良、热度之高只有亲身体会一下才能了解；目前github上前端项目总量排名第一微笑。

**IDE**

Sublime、Notepad++、EditPlus、Ultra Editor都行；个人觉得WebStorm实在强悍，值得一试。

**之后的安排**

希望在开始介绍代码之前能让大家看到一个活的node，一个真正改变我们技术生活的node；所以首先介绍NPM，简介+所有模块分类+热门模块介绍；之后可能有：
* node开发环境
* node api结构剖析
* 动手开发一个模块
* connect & express简介
* connect源码分析
* express源码分析
* grunt
* …

暂时想到这些。
