## Karma的介绍

Karma是一个基于Node.js的JavaScript测试执行过程管理工具（Test Runner）。

该工具可用于测试所有主流Web浏览器，也可集成到CI（Continuous integration）工具，也可和其他代码编辑器一起使用。

这个测试工具的一个强大特性就是，它可以监控(Watch)文件的变化，然后自行执行，通过console.log显示测试结果。

## Karma的安装

```
# 安装Karma
~ D:\workspace\javascript\karma>npm install -g karma

# Install plugins that your project needs:
$ npm install karma-jasmine karma-chrome-launcher --save-dev

# Typing ./node_modules/karma/bin/karma start sucks,
# so you might find it useful to install karma-cli globally.
$ npm install -g karma-cli

# 测试是否安装成功
~ D:\workspace\javascript\karma>karma start

```
从浏览器看到karam界面。

## Karma 配置 (with Jasmine)

初始化karma配置文件 *.conf.js
```
# using karma init:

$ karma init my.conf.js

Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> jasmine

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture a browser automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
> Firefox
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
> *.js
> test/**/*.js
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> yes

Config file generated at "/Users/vojta/Code/karma/my.conf.js".
```

安装集成包karma-jasmine
```
~ D:\workspace\javascript\karma>npm install karma-jasmine
```

## 自动化单元测试

1. 创建源文件：用于实现某种业务逻辑的文件，就是我们平时写的js脚本
2. 创建测试文件：符合jasmineAPI的测试js脚本
3. 修改karma.conf.js配置文件


**1). 创建源文件：**

用于实现某种业务逻辑的文件，就是我们平时写的js脚本有一个需求，要实现单词倒写的功能。如：”ABCD” ==> “DCBA”
```
~ vi src.js

function reverse(name){
    return name.split("").reverse().join("");
}
```
**2). 创建测试文件：**

符合jasmineAPI的测试js脚本
```
describe("A suite of basic functions", function() {
    it("reverse word",function(){
        expect("DCBA").toEqual(reverse("ABCD"));
    });
});
```
**3). 修改karma.conf.js配置文件**

我们这里需要修改：files和exclude变量
```
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: ['*.js'],
        exclude: ['karma.conf.js'],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 60000,
        singleRun: false
    });
};
```
**启动karma,单元测试全自动执行**
```

# karma start karma.conf.js

// karma start my.conf.js --log-level debug --single-run
// karma start --help
INFO [karma]: Karma v0.10.2 server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
WARN [launcher]: The path should not be quoted.
  Normalized the path to C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
INFO [Chrome 28.0.1500 (Windows 7)]: Connected on socket bVGffDWpc1c7QNdYye_6
INFO [Chrome 28.0.1500 (Windows 7)]: Connected on socket DtTdVbd4ZsgnMQrgye_7
Chrome 28.0.1500 (Windows 7): Executed 1 of 1 SUCCESS (3.473 secs / 0.431 secs)
Chrome 28.0.1500 (Windows 7): Executed 1 of 1 SUCCESS (0.068 secs / 0.021 secs)
TOTAL: 2 SUCCESS
```
浏览器会自动打开

**更新自动执行**

我们修改test.js
```
describe("A suite of basic functions", function() {
    it("reverse word",function(){
        expect("DCBA").toEqual(reverse("ABCD"));
        expect("Conan").toEqual(reverse("nano"));
    });
});
```
由于karma.conf.js配置文件中autoWatch: true, 所以test.js文件保存后，会自动执行单元测试。

执行日志如下：提示我们单元测试出错了。

```
INFO [watcher]: Changed file "D:/workspace/javascript/karma/test.js".
Chrome 28.0.1500 (Windows 7) A suite of basic functions reverse word FAILED
        Expected 'Conan' to equal 'onan'.
        Error: Expected 'Conan' to equal 'onan'.
            at null. (D:/workspace/javascript/karma/test.js:4:25)
Chrome 28.0.1500 (Windows 7): Executed 1 of 1 (1 FAILED) ERROR (0.3 secs / 0.006 secs)
```

## Karma和istanbul代码覆盖率

增加代码覆盖率检查和报告，增加istanbul依赖

``` npm install karma-coverage```

修改karma.conf.js配置文件

```
reporters: ['progress','coverage'],
preprocessors : {'src.js': 'coverage'},
coverageReporter: {
    type : 'html',
    dir : 'coverage/'
}
```

启动karma start，在工程目录下面找到index.html文件，coverage/chrome/index.html,打开后，我们看到代码测试覆盖绿报告 : 覆盖率是100%，说明我们完整了测试了src.js的功能。

接下来，我们修改src.js，增加一个if分支
```
function reverse(name){
    if(name=='AAA') return "BBB";
    return name.split("").reverse().join("");
}
```
再看覆盖率报告，Statements：75%覆盖，Branches：50%覆盖。

为了产品的质量我们要尽量达到更多的覆盖率，一般对于JAVA项目来说，能达到80%就是相当高的标准了。对于Javascript的代码测试及覆盖率研究，我还要做更多的验证。

1. 匿名闭包，无法测试。
2. 闭包运行时scope不确定，写测试有难度。
3. 通过架构或框架，标准化代码结构，禁止在功能代码中用闭包。

## Other : Karma第一次启动时出现的问题

CHROME_BIN的环境变量问题
```
~ D:\workspace\javascript\karma>karma start karma.conf.js
INFO [karma]: Karma v0.10.2 server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
ERROR [launcher]: Cannot start Chrome
        Can not find the binary C:\Users\Administrator\AppData\Local\Google\Chrome\Application\chrome.exe
        Please set env variable CHROME_BIN
```
设置方法：找到系统中chrome的安装位置，找到chrome.exe文件
```
~ D:\workspace\javascript\karma>set CHROME_BIN="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
```

