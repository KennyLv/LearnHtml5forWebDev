Mocha是一个任务运行器，因此实际上它并不会太关心测试本身，它关心的只是测试的结构，和Jasmine以及其他完整的测试套件不同：
Mocha只关心总体的结构，而对于实际的断言毫不关心。
这不仅允许我们持续观察测试，同时也允许我们自由选择使用自己喜欢的断言库 : 
Chai.js
Should.js

## 搭建mocha测试环境并使用selenium进行测试##

一、搭建mocha测试环境
　　mocha是node.js下常用的测试框架。其安装步骤如下：
		　　1）到node.js的网站http://nodejs.org/上点击最显眼的绿色的图标“install”下载安装文件
		　　2）下载后，双击该安装文件安装node.js
		　　3）到命令行下输入 “node -v” ，如果会打印出node的版本信息，则node安装成功
		　　4）在命令行下输入 “sudo npm -g install mocha”以global的方式安装mocha （windows系统不识别sudo，可忽略sudo）
		　　5）在命令行下输入 “mocha -h” ，如果会输出帮助信息，则mocha安装成功
		　　6）新建一个文件夹，如命名为mocha-test，在该文件夹下新建一个package.json文件，package.json里的内容如下：
						{
								"name": "Inkie_test"，
								"version": "0.0.1"，
								"description": "testcases of Inkie"，
								"main" : "index.js"，
								"scripts":{
										"test":""
								}，
								"dependencies" : {
										"selenium-webdriver" : "~2.35.0"，
										"chai" : "~1.8.1"
								}
						}
		　　		在命令行下切换到mocha-test目录，输入命令“sudo npm install”下载package.json里描述的依赖，然后该文件夹下会多出一个名为node_modules的文件夹。
		　　7）安装firefox浏览器
		　　8）（mac请忽略此步骤）把firefox浏览器的路径加到系统环境变量中，如果在命令行中能用start firefox命令启动火狐浏览器，则windows系统环境变量添加成功。
二、启动selenium server
		　　1）在http://code.google.com/p/selenium/上下载selenium-server-standalone-2.36.0.jar（版本信息可能不同）
		　　2）在命令行下输入“java -jar selenium-server-standalone-2.36.0.jar”以启动服务（没装Java的要先装Java）。
三、测试实例
		　　以下是用BDD写的一个测试示例test.js，该测试的目的是打开google主页，搜索mocha，并检查搜索结果网页的title是否含有mocha关键字。
							var should = require('chai').should();
							var webdriver = require('selenium-webdriver');
							var By = webdriver.By;

							var builder = new webdriver.Builder().usingServer("http://127.0.0.1:4444/wd/hub");
							builder.withCapabilities({ browserName : "firefox" });
							var driver = builder.build();

							describe ('first test'， function () {
									beforeEach(function () {
											driver.get('http://www.google.com');
									});

									afterEach(function () {
											driver.close();
											driver.quit();
									});

									it('should have correct title'， function (done) {
											driver.findElement(By.css('#lst-ib')).sendKeys('mocha');
											driver.findElement(By.css('[name="btnK"]')).click();
											driver.sleep(3000);
											driver.getTitle().then(function (title) {
													title.should.contain('mocha');
													done();
											});
									});
							});
		　　在命令行中切换到测试目录，如本例中新建的mocha-test目录，输入以下命令以启动测试：
				　　			mocha -t 30000 -R spec test.js
						"-t 30000"是设置一个测试用例(一个it函数表示一个测试用例)运行的时间不超过30秒，
						"-R spec"是设置测试结果的输出格式。
		
		关于mocha运行测试的更多参数不再赘述。

## 集成Mocha到Grunt##
			安装grunt-mocha-test插件，命令如下
							npm install grunt-mocha-test
			Gruntfile代码如下，比较简单，这里不做太多说明。关于mochaTest的选项，参见https://github.com/pghalliday/grunt-mocha-test
					mochaTest: {
								tdd_test: {
											options: {
														ui: 'tdd',
														reporter: 'spec'        
											},
											src: ['<%= pkg.name%>/tdd_api_testcase/prepare_browser.js','<%= pkg.name%>/tdd_api_testcase/test_*.js']
								},      
								bdd_test: {
											options: {          
														reporter: 'spec',
														output: '<%= pkg.name%>/bdd_api_testcase/result.txt',
														require: 'blanket'
											},
											src: ['<%= pkg.name%>/bdd_api_testcase/*.js']
								},
								coverage: {
											options: {
														reporter: 'html-cov',
														// use the quiet flag to suppress the mocha console output
														quiet: true,
														// specify a destination file to capture the mocha
														// output (the quiet option does not suppress this)
														captureFile: '<%= pkg.name%>/coverage.html'
											},
											src: ['<%= pkg.name%>/tdd_api_testcase/*.js']
								},
								testReporter: {
											options: {
													output: 'frame_test/result.txt'    
											}
								}   
					}




