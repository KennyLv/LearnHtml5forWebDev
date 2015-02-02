# Hello Node

## Node安装

windows下直接使用安装包安装；其他平台也有对应的安装包或下载源码安装。安装完毕后请使用如下命令验证，如果一切顺利可以看到node版本号:

$ node -v

## Node文档

推荐使用在线版本；如需离线版本可从github clone node代码，linux下可编译出完整的api文档。

$ git clone git://github.com/joyent/node.git
$ cd node
$ make doc

## Hello Node

**先跑起来**

下面的demo来自nodejs.org（有小改）：

```
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

将其保存为hello.js，命令行中输入
```
$ node hello.js

Server running at http://127.0.0.1:1337/
```
一个简易的http server就运行起来了，浏览器中敲入
```
http://127.0.0.1:1337/
```
**逐行分析**

//node使用javascript作为其应用层编程语言，所以node程序的语法和js无差
```
//声明node自定义模块（http）
var http = require('http');
//创建并启动http server
http.createServer(
//每次请求到来触发如下回调
function (req, res) {
  //输出http header
  res.writeHead(200, {'Content-Type': 'text/plain'});
  //输出http body，并完成response操作
  res.end('Hello World\n');
//监听 127.0.0.1:1337 的请求,
}).listen(1337, '127.0.0.1');
//console.log和浏览器中使用习惯一致
//这里会将日志打印至标准输出（即命令行界面）
console.log('Server running at http://127.0.0.1:1337/');
```
**A Simple Static Server**

这里提供一个较简单的静态文件服务器代码（下载完整demo），感兴趣的同学可以对照API文档：

```
var
    http = require('http'),
    url = require('url'),
    fs = require('fs');
// 创建并启动服务器
// 浏览器地址栏输入 http://127.0.0.1:3001/demo.html
http.createServer(function (req, res) {
    var pathname = __dirname + '/public' + url.parse(req.url).pathname;
    // 读取本地文件
    // node的设计理念之一：web server每个处理环节都是异步的
    fs.readFile(pathname, function (err, data) {
        if (err) {
            res.writeHead(500);
            res.end('500');
        } else {
            // 这里可以对文件类型判断，增加Content-Type
            res.end(data);
        }
    });
}).listen(3001, function () {
        console.log('http.Server started on port 3001');
    });

```
