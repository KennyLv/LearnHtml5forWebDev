# 发布自己的模块

之前的文章反复提及模块在node中的重要性。正因为有了模块，node才有了扩展性，才会有如此多的node社区成员参与进来，node才能如此迅速地发展。
> NPM（Node Packaged Module，之后简称module或模块）是node的内置功能，通过module的形式为node带来更多的API。其实node原生API也是通过模块的形式提供给开发者使用的。

## 模块

node实现了[commonjs module规范](http://www.commonjs.org/specs/modules/1.0/)。下面的例子来自Module规范，修改了require输入参数以便能在node中运行，请参照注释分别保存至3个文件中，或者下载完整示例代码：
```
// 这段代码保存为文件math.js
exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};

// 这段代码保存为文件increment.js
var add = require('./math').add;
exports.increment = function(val) {
    return add(val, 1);
};

// 这段代码保存为文件program.js
var inc = require('./increment').increment;
var a = 1;
inc(a); // 2
console.log('a=', inc(a));
```
**模块分类**

node中模块可分为核心模块(Core Module)和第三方模块，核心模块是node内置模块，通常存在于node安装路径lib目录下；第三方模块也就是本文讨论并期望创建的模块。

**Require & Module path**

上面的代码中出现的require是node中加载模块的全局函数，node是如何寻找到对应模块的呢？简明规则如下：

```
路径为Y的module中使用 require(X)
如果是X为核心模块，命中则结束
如果X以‘./’、‘/’、‘../’开头时，加载第三方模块，命中则结束
查找失败抛出异常
```
这里能看到[完整描述](http://nodejs.org/api/modules.html#modules_all_together)：

```
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with './' or '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
3. LOAD_NODE_MODULES(X, dirname(Y))
4. THROW "not found"

LOAD_AS_FILE(X)
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.node is a file, load X.node as binary addon.  STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. let M = X + (json main field)
   c. LOAD_AS_FILE(M)
2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
3. If X/index.node is a file, load X/index.node as binary addon.  STOP

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let ROOT = index of first instance of "node_modules" in PARTS, or 0
3. let I = count of PARTS - 1
4. let DIRS = []
5. while I > ROOT,
   a. if PARTS[I] = "node_modules" CONTINUE
   c. DIR = path join(PARTS[0 .. I] + "node_modules")
   b. DIRS = DIRS + DIR
   c. let I = I - 1
6. return DIRS
```

## 模块结构

connect-header是笔者使用express期间写的一个小模块，足够简单且包含了第三方模块的诸多元素，比较适合作为入门示例。
这里用connect-header作为示例，欢迎fork，同样可用下面命令安装：
```
$ npm install connect-header
```
**文件结构**

以下假设之前执行npm install的路径为X，我们看到connect-header被安装在X/node_modules/connect-header；X/node_modules是node安装第三方模块的默认位置;node已不推荐将模块[安装至全局路径](http://nodejs.org/api/modules.html#modules_loading_from_the_global_folders)下，更推荐本地安装，可能是出于移植的考虑。

```
lib 模块代码
    header.js 代码写在这里！
    index.js node默认加载模块
test Unit Test
    header.js
.npmignore 模块发布时本地文件忽略列表
LICENSE 版权声明
package.json 模块属性声明
README.md 模块介绍
test.js UT启动脚本
```

**package.json**

模块中最为重要的文件，申明了各种模块级别的属性，或称为元数据。这些元数据部分由npm程序读取，部分是npmjs.org上模块页面的数据源。完[整文档请参考npm json](https://npmjs.org/doc/json.html)，网上找到的一个[交互文档](http://package.json.nodejitsu.com/)也可参考。首次接触package.json可以使用”npm init”，这是个交互式package.json生成工具。
```
$ npm init
```
针对connect-header的package.json，我们分析每个字段的意义（见注释）：
```
{
  "name":"connect-header", //模块名称
  "version":"0.0.5", //模块版本号
  "description":"General header middleware for Connect.",
  "author":{ //模块作者信息
    "name":"Luics",
    "email":"luics.king@gmail.com",
    "url":"http://github.com/luics"
  },
  "repository":{ //模块代码库
    "type":"git",
    "url":"https://github.com/luics/connect-header.git"
  },
  "bugs":{ //Bug提交页面
    "url":"http://github.com/luics/connect-header/issues"
  },
  "main":"./lib", //模块入口
  "dependencies":{
  },
  "devDependencies":{ //开发依赖模块
    "qunit":"*" //用于unit test
  },
  "scripts":{ //unit test脚本
    "test":"node test"
  },
  "engines":{ //依赖的node版本
    "node":">= 0.4.0"
  },
  "licenses":[ //版权信息
    {
      "type":"MIT",
      "url":"http://www.opensource.org/licenses/MIT"
    }
  ],
  "keywords":["connect", "express", "header", "general"]
}
```
**README**

主要包括模块背景介绍，使用说明，sample代码，资源连接；是其他人了解模块的主要途径，一般高质量的模块都会有一个结构清晰、介绍详尽的README；npmjs和github上的都支持markdown格式的README，一般文件后缀为mk、markdown。

**Unit Test**

UT是其他开发者了解模块的一个窗口，比起README，UT更加接近模块的实现细节；通常高质量的模块也会有高质量的UT代码；UT的质量可以通过覆盖率等衡量..

## 模块发布

下面的命令用于发布模块：
```
$ npm publish
```
首次使用“npm publish”会失败，提示需要先使用“npm adduser”添加一[个npmjs.org](https://www.npmjs.com/)的账号。之后每次使用“npm publish”需要手动更新package.json的version字段。

## 更多资源

[markdown-util](https://github.com/luics/markdown-util)是笔者写的另一个模块，同样比较简单，用于将markdown源文件生成html文件，并提供了2套皮肤（github、default），支持自定义皮肤模板。

更多优质资源自然都在NPM Registry中，日后也会挑出不同类型的典型模块详细分析。
```
$ npm install markdown-util
```



