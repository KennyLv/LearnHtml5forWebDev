// node���������֮һ��web serverÿ�������ڶ����첽��
var
http = require('http'),
url = require('url'),
fs = require('fs');

// ����������������
// �������ַ������ http://127.0.0.1:1337/demo.html
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
					// ��ȡ�����ļ�
					fs.readFile(pathname, function (err, data) {
							if (err) {
									console.log('Error with : ' + pathname);
									//res.writeHead(500);
									//res.end('500');
							} else {
									console.log('Succeed!');
									// ������Զ��ļ������жϣ�����Content-Type
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
