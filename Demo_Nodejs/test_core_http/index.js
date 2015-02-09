// node的设计理念之一：web server每个处理环节都是异步的
var
http = require('http'),
url = require('url'),
fs = require('fs');

// 创建并启动服务器
// 浏览器地址栏输入 http://127.0.0.1:1337/demo.html
http.createServer(function (req, res) {
		console.log('begin create http.Server....');
		var path = url.parse(req.url).pathname;
		
		switch (path){
			case '/' :
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Hello World !');
			break;
			case '/index.html' :
			case '/demo.html' :
					var pathname = __dirname + '/files/demo.html';
					// 读取本地文件
					fs.readFile(pathname, function (err, data) {
							if (err) {
									console.log('Error with : ' + pathname);
									//res.writeHead(500);
									//res.end('500');
							} else {
									console.log('Succeed!');
									// 这里可以对文件类型判断，增加Content-Type
									//res.writeHead(200, {'Content-Type': 'text/plain'});
									res.writeHead(200, {'Content-Type': 'text/html'});
									res.end(data);
							}
					});
			break;
			default: 
					res.writeHead(404);
					res.write('404');
					res.end();
			break;
		}
		
}).listen(1337, '127.0.0.1', 'ee', function(){
	console.log('http.Server started on port 1337');
});
