## AMD 简介

前端开发在近一两年发展的非常快，JavaScript 作为主流的开发语言得到了前所未有的热捧。大量的前端框架出现了，这些框架都在尝试着解决一些前端开发中的共性问题，但是实现又不尽相同。在这个背景下，CommonJS 社区诞生了，为了让前端框架发展的更加成熟，CommonJS 鼓励开发人员一起在社区里为一些完成特定功能的框架制定规范。AMD（Asynchronous Module Definition）就是其中的一个规范。

**传统 JavaScript 代码的问题**

让我们来看看一般情况下 JavaScript 代码是如何开发的：通过``` <script>``` 标签来载入 JavaScript 文件，用全局变量来区分不同的功能代码，全局变量之间的依赖关系需要显式的通过指定其加载顺序来解决，发布应用时要通过工具来压缩所有的 JavaScript 代码到一个文件。当 Web 项目变得非常庞大，前端模块非常多的时候，手动管理这些全局变量间的依赖关系就变得很困难，这种做法显得非常的低效。

为实现与Node.js相同方式的模块写法，大牛们做了很多努力。但浏览器环境不同于服务器端，它的模块有一个HTTP请求过程(而Node.js的模块文件就在本地)，这个请求过程多数使用script tag，script 默认的异步性导致很难实现与Node.js一模一样的模块格式。

Modules/Wrappings 使得实现变为现实。虽然和Node.js的模块写法不完全一致，但也有很多相似之处，使得熟悉Node.js的程序员有一些亲切感。

但Node.js终究是服务器端的JavaScript，没有必要把这些条条框框放到浏览器JavaScript环境中。

这时AMD 诞生了，它的全称为异步模块定义。



**AMD 的引入**

从名称上看便知它是适合script tag的。也可以说AMD是专门为浏览器中JavaScript环境设计的规范。

它吸取了CommonJS的一些优点，但又不照搬它的格式。

开始AMD作为CommonJS的transport format存在，因无法与CommonJS开发者达成一致而独立出来。它有自己的wiki 和讨论组 。

AMD 提出了一种基于模块的异步加载 JavaScript 代码的机制，它推荐开发人员将 JavaScript 代码封装进一个个模块，对全局对象的依赖变成了对其他模块的依赖，无须再声明一大堆的全局变量。通过延迟和按需加载来解决各个模块的依赖关系。

模块化的 JavaScript 代码好处很明显，各个功能组件的松耦合性可以极大的提升代码的复用性、可维护性。这种非阻塞式的并发式快速加载 JavaScript 代码，使 Web 页面上其他不依赖 JavaScript 代码的 UI 元素，如图片、CSS 以及其他 DOM 节点得以先加载完毕，Web 页面加载速度更快，用户也得到更好的体验。

CommonJS 的 AMD 规范中只定义了一个全局的方法，AMD设计出一个简洁的写模块API：

    define(id?, dependencies?, factory);

该方法用来定义一个 JavaScript 模块，开发人员可以用这个方法来将部分功能模块封装在这个 define 方法体内。

* id 表示该模块的标识，为可选参数。
* dependencies 是一个字符串 Array，表示该模块依赖的其他所有模块标识，模块依赖必须在真正执行具体的 factory 方法前解决，这些依赖对象加载执行以后的返回值，可以以默认的顺序作为 factory 方法的参数。
* dependencies 也是可选参数，当用户不提供该参数时，实现 AMD 的框架应提供默认值为 [“require”，”exports”，“module”]。
* factory 是一个用于执行改模块的方法，它可以使用前面 dependencies 里声明的其他依赖模块的返回值作为参数，若该方法有返回值，当该模块被其他模块依赖时，返回值就是该模块的输出。

> id遵循CommonJS Module Identifiers 。dependencies元素的顺序和factory参数一一对应。

CommonJS 在规范中并没有详细规定其他的方法，一些主要的 AMD 框架如 RequireJS、curl、bdload 等都实现了 define 方法，同时各个框架都有自己的补充使得其 API 更实用。


## e.g.

以下是使用AMD模式开发的简单三层结构（基础库/UI层/应用层）：
```
// base.js
define(function() {
    return {
        mix: function(source, target) {
        }
    };
});

// ui.js
define(['base'], function(base) {
    return {
        show: function() {
            // todo with module base
        }
    }
});

// page.js
define(['data', 'ui'], function(data, ui) {
    // init here
});

// data.js
define({
    users: [],
    members: []
});
```

以上同时演示了define的三种用法
* 1, 定义无依赖的模块（base.js）
* 2, 定义有依赖的模块（ui.js，page.js）
* 3, 定义数据对象模块（data.js）

细心的会发现，还有一种没有出现，即具名模块

* 4, 具名模块

```
define('index', ['data','base'], function(data, base) {
    // todo
});
```

具名模块多数时候是不推荐的，一般由打包工具合并多个模块到一个js文件中时使用。

前面提到dependencies元素的顺序和factory一一对应，其实不太严谨。AMD开始为摆脱CommonJS的束缚，开创性的提出了自己的模块风格。但后来又做了妥协，兼容了 CommonJS Modules/Wrappings 。即又可以这样写

* 5，包装模块

```
define(function(require, exports, module) {
    var base = require('base');
    exports.show = function() {
        // todo with module base
    }
});
```

不考虑多了一层函数外，格式和Node.js是一样的：使用require获取依赖模块，使用exports导出API。

除了define外，AMD还保留一个关键字require。require 作为规范保留的全局标识符，可以实现为 module loader，也可以不实现。

目前，实现AMD的库有[RequireJS](http://requirejs.org/) 、[curl](https://github.com/unscriptable/curl) 、[Dojo](http://dojotoolkit.org/) 、[bdLoad](http://bdframework.org/bdLoad/)、[JSLocalnet](http://wiki.commonjs.org/wiki/Implementations/JsDev) 、[Nodules](http://wiki.commonjs.org/wiki/Implementations/Nodules) 等。
也有很多库支持AMD规范，即将自己作为一个模块存在，如MooTools 、jQuery 、[qwery](https://github.com/ded/qwery) 、bonzo  甚至还有 firebug 。

相关：
> [AMD No Longer A CommonJS Specification](http://groups.google.com/group/commonjs/browse_thread/thread/96a0963bcb4ca78f/cf73db49ce267ce1?lnk=gst)

> [UMD和ECMAScript模块](http://www.cnblogs.com/snandy/archive/2012/03/19/2406596.html)
