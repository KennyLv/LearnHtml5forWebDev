var http = require('http');
var fs = require('fs');
  
function Mzitu(options) {
  this.id = 1;
  this.initialize.call(this, options);
  return this;
}
  
Mzitu.prototype = {
	constructor: Mzitu,
	
	initialize: function _initialize(options) {
			this.baseUrl = options.baseUrl;
			this.reg = options.reg;
			this.total = options.total;
			this.page = options.from || 1;
			this.storePath = options.storePath|| '';
			if (!fs.existsSync(this.storePath )) {
					fs.mkdirSync(this.storePath );
					console.log('目录创建成功');
			}
	},

	start: function _start() {
			this.getPage();
	},
	
	/*
	 * 根据pageNum拼写URL地址,获取页面HTML
	*/
	getPage: function _getPage() {
			var self = this, data = null;
			if (this.page <= this.total) {
					http.get(this.baseUrl + this.page, function (res) {
							res.setEncoding("utf8");
							res.on('data', function (chunk) {
									data += chunk;
							}).on('end', function () {
									self.parseData(data);
							});
					});
			}
	},
	/*
	 * 根据正则表达式，解析HTML中的图片地址
	*/
	parseData: function _parseData(data) {
			var res = [], match;
			while ((match = this.reg.exec(data)) != null) {
				res.push(match[1]);
			}
			this.download(res);
	},

	/*
	 * 根据图片地址，下载图片并保存
	*/
	download: function _download(resource) {
			var self = this, currentPage = self.page;
			resource.forEach(function (src, idx) {
					//var filename = src.substring(src.lastIndexOf('/') + 1);
					var filename = src.substring(src.lastIndexOf('images_content/') + 15).replace('/','_');
					var writestream = fs.createWriteStream(self.storePath + filename);
					http.get(src, function (res) {
							res.pipe(writestream);
					});
					writestream.on('finish', function () {
							console.log('page: ' + currentPage + ' id: ' + self.id++ + ' download: ' + filename);
					});
			});
			self.page++;
			self.getPage();
	}
	
};

/*
//http://www.mzitu.com/share/
var mzitu = new Mzitu({
  baseUrl: 'http://www.mzitu.com/share/comment-page-',
	storePath:'E:/TDDOWNLOAD/mzitu/',
  reg: /<img\s*src="(.*?)"\s*alt=".*"\s*\/>/g,
  total: 1,
  from: 1
});
mzitu.start();
*/

// http://www.18eighteen.com/
var eighteen = new Mzitu({
	baseUrl: '',
	storePath:'E:/TDDOWNLOAD/eighteen/',
	reg: /<img\s*src="(.*?)"\s*alt=".*"\s*\/>/g,
	total: 1,
	from: 1
});
var imgLinks = [];
var baseUrl = [
	"http://scoregroup.vo.llnwd.net/o37/18eighteen/images_content/AlliRae_31013/"/*,
	"http://scoregroup.vo.llnwd.net/o37/18eighteen/images_content/JennaMarie_30900/",
	"http://scoregroup.vo.llnwd.net/o37/18eighteen/images_content/PiperPerri_31425/",
	"http://scoregroup.vo.llnwd.net/o37/18eighteen/images_content/DakotaBlaze_31493/"	*/
];
for(var j=0;j<baseUrl.length;j++){
	for(var i=1;i<=16;i++){
		if(i<10){
			imgLinks.push(baseUrl[j] + "0" + i + ".jpg" );
		}else{
			imgLinks.push(baseUrl[j] +  i + ".jpg" );
		}
	}
}
eighteen.download(imgLinks);









