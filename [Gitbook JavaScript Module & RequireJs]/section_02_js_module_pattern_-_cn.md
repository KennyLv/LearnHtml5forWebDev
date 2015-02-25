## Javascript模块化编程

> http://www.ruanyifeng.com/blog/2012/10/javascript_module.html
> http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html



**相关链接：**

https://github.com/seajs/seajs/issues/269
http://www.cnblogs.com/snandy/archive/2012/03/09/2386092.html
http://www.zhihu.com/question/20351507
http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html
http://seajs.org/docs/#docs



随着网站逐渐变成"互联网应用程序"，嵌入网页的Javascript代码越来越庞大，越来越复杂。
网页越来越像桌面程序，需要一个团队分工协作、进度管理、单元测试等等......开发者不得不使用软件工程的方法，管理网页的业务逻辑。

Javascript模块化编程，已经成为一个迫切的需求。理想情况下，开发者只需要实现核心的业务逻辑，其他都可以加载别人已经写好的模块。

但是，Javascript不是一种模块化编程语言，它不支持"类"（class），更遑论"模块"（module）了。（正在制定中的ECMAScript标准第六版，将正式支持"类"和"模块"，但还需要很长时间才能投入实用。）
Javascript社区做了很多努力，在现有的运行环境中，实现"模块"的效果。本文总结了当前＂Javascript模块化编程＂的最佳实践，说明如何投入实用。虽然这不是初级教程，但是只要稍稍了解Javascript的基本语法，就能看懂。

### Part1 - Javascript定义类（class）的三种方法

将近20年前，Javascript诞生的时候，只是一种简单的网页脚本语言。如果你忘了填写用户名，它就跳出一个警告。如今，它变得几乎无所不能，从前端到后端，有着各种匪夷所思的用途。程序员用它完成越来越庞大的项目。
Javascript代码的复杂度也直线上升。

编写和维护如此复杂的代码，必须使用模块化策略。目前，业界的主流做法是采用"面向对象编程"。因此，Javascript如何实现面向对象编程，就成了一个热门课题。

麻烦的是，Javascipt语法不支持"类"（class，在面向对象编程中，类（class）是对象（object）的模板，定义了同一组对象（又称"实例"）共有的属性和方法），导致传统的面向对象编程方法无法直接使用，但是可以用一些变通的方法，模拟出"类"。程序员们做了很多探索，研究如何用Javascript模拟"类"。

**一、构造函数法**

这是经典方法，也是教科书必教的方法。它用构造函数模拟"类"，在其内部用this关键字指代实例对象。
```
　　function Cat() {
　　　　this.name = "大毛";
　　}
```
生成实例的时候，使用new关键字。
```
　　var cat1 = new Cat();
　　alert(cat1.name); // 大毛
```
类的属性和方法，还可以定义在构造函数的prototype对象之上。
```
　　Cat.prototype.makeSound = function(){
　　　　alert("喵喵喵");
　　}
```
关于这种方法的详细介绍，请看我写的系列文章[《Javascript 面向对象编程》](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)，这里就不多说了。它的主要缺点是，比较复杂，用到了this和prototype，编写和阅读都很费力。

**二、Object.create()法**

为了解决"构造函数法"的缺点，更方便地生成对象，Javascript的国际标准ECMAScript第五版（目前通行的是第三版），提出了一个新的方法Object.create()。
用这个方法，"类"就是一个对象，不是函数。
```
　　var Cat = {
　　　　name: "大毛",
　　　　makeSound: function(){ alert("喵喵喵"); }
　　};
```
然后，直接用Object.create()生成实例，不需要用到new。
```
　　var cat1 = Object.create(Cat);
　　alert(cat1.name); // 大毛
　　cat1.makeSound(); // 喵喵喵
```
目前，各大浏览器的最新版本（包括IE9）都部署了这个方法。如果遇到老式浏览器，可以用下面的代码自行部署。
```
　　if (!Object.create) {
　　　　Object.create = function (o) {
　　　　　　 function F() {}
　　　　　　F.prototype = o;
　　　　　　return new F();
　　　　};
　　}
```
这种方法比"构造函数法"简单，但是不能实现私有属性和私有方法，实例对象之间也不能共享数据，对"类"的模拟不够全面。

**三、极简主义法**

荷兰程序员Gabor de Mooij提出了一种比Object.create()更好的新方法，他称这种方法为"极简主义法"（minimalist approach）。这也是我推荐的方法。

#### 3.1 封装

这种方法不使用this和prototype，代码部署起来非常简单，这大概也是它被叫做"极简主义法"的原因。
首先，它也是用一个对象模拟"类"。在这个类里面，定义一个构造函数createNew()，用来生成实例。
```
　　var Cat = {
　　　　createNew: function(){
　　　　　　// some code here
　　　　}
　　};
```
然后，在createNew()里面，定义一个实例对象，把这个实例对象作为返回值。
```
　　var Cat = {
　　　　createNew: function(){
　　　　　　var cat = {};
　　　　　　cat.name = "大毛";
　　　　　　cat.makeSound = function(){ alert("喵喵喵"); };
　　　　　　return cat;
　　　　}
　　};
```
使用的时候，调用createNew()方法，就可以得到实例对象。
```
　　var cat1 = Cat.createNew();
　　cat1.makeSound(); // 喵喵喵
```
这种方法的好处是，容易理解，结构清晰优雅，符合传统的"面向对象编程"的构造，因此可以方便地部署下面的特性。

#### 3.2 继承

让一个类继承另一个类，实现起来很方便。只要在前者的createNew()方法中，调用后者的createNew()方法即可。
先定义一个Animal类。
```
　　var Animal = {
　　　　createNew: function(){
　　　　　　var animal = {};
　　　　　　animal.sleep = function(){ alert("睡懒觉"); };
　　　　　　return animal;
　　　　}
　　};
```
然后，在Cat的createNew()方法中，调用Animal的createNew()方法。
```
　　var Cat = {
　　　　createNew: function(){
　　　　　　var cat = Animal.createNew();
　　　　　　cat.name = "大毛";
　　　　　　cat.makeSound = function(){ alert("喵喵喵"); };
　　　　　　return cat;
　　　　}
　　};
```
这样得到的Cat实例，就会同时继承Cat类和Animal类。
```
　　var cat1 = Cat.createNew();
　　cat1.sleep(); // 睡懒觉
```

#### 3.3 私有属性和私有方法

在createNew()方法中，只要不是定义在cat对象上的方法和属性，都是私有的。
```
　　var Cat = {
　　　　createNew: function(){
　　　　　　var cat = {};
　　　　　　var sound = "喵喵喵";
　　　　　　cat.makeSound = function(){ alert(sound); };
　　　　　　return cat;
　　　　}
　　};
```
上例的内部变量sound，外部无法读取，只有通过cat的公有方法makeSound()来读取。
```
　　var cat1 = Cat.createNew();
　　alert(cat1.sound); // undefined
```

#### 3.4 数据共享

有时候，我们需要所有实例对象，能够读写同一项内部数据。这个时候，只要把这个内部数据，封装在类对象的里面、createNew()方法的外面即可。
```
　　var Cat = {
　　　　sound : "喵喵喵",
　　　　createNew: function(){
　　　　　　var cat = {};
　　　　　　cat.makeSound = function(){ alert(Cat.sound); };
　　　　　　cat.changeSound = function(x){ Cat.sound = x; };
　　　　　　return cat;
　　　　}
　　};
```
然后，生成两个实例对象：
```
　　var cat1 = Cat.createNew();
　　var cat2 = Cat.createNew();
　　cat1.makeSound(); // 喵喵喵
```
这时，如果有一个实例对象，修改了共享的数据，另一个实例对象也会受到影响。
```
　　cat2.changeSound("啦啦啦");
　　cat1.makeSound(); // 啦啦啦
```



### Part2 - 模块的写法

** 一、原始写法**

模块就是实现特定功能的一组方法。
只要把不同的函数（以及记录状态的变量）简单地放在一起，就算是一个模块。
```
　　function m1(){
　　　　//...
　　}
　　function m2(){
　　　　//...
　　}
```
上面的函数m1()和m2()，组成一个模块。使用的时候，直接调用就行了。

这种做法的缺点很明显："污染"了全局变量，无法保证不与其他模块发生变量名冲突，而且模块成员之间看不出直接关系。

** 二、对象写法 **

为了解决上面的缺点，可以把模块写成一个对象，所有的模块成员都放到这个对象里面。
```
    var module1 = new Object({
　　　　_count : 0,
　　　　m1 : function (){
　　　　　　//...
　　　　},
　　　　m2 : function (){
　　　　　　//...
　　　　}
　　});
```

上面的函数m1()和m2(），都封装在module1对象里。使用的时候，就是调用这个对象的属性。

    module1.m1();

但是，这样的写法会暴露所有模块成员，内部状态可以被外部改写。比如，外部代码可以直接改变内部计数器的值。

    module1._count = 5;

** 三、立即执行函数写法 **

> http://benalman.com/news/2010/11/immediately-invoked-function-expression/

使用"立即执行函数"（Immediately-Invoked Function Expression，IIFE），可以达到不暴露私有成员的目的。
```
　　var module1 = (function(){
　　　　var _count = 0;
　　　　var m1 = function(){
　　　　　　//...
　　　　};
　　　　var m2 = function(){
　　　　　　//...
　　　　};
　　　　return {
　　　　　　m1 : m1,
　　　　　　m2 : m2
　　　　};
　　})();
```
使用上面的写法，外部代码无法读取内部的_count变量。

    console.info(module1._count); //undefined

module1就是Javascript模块的基本写法。下面，再对这种写法进行加工。

**四、放大模式**

如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块，这时就有必要采用"放大模式"（augmentation）。
```
　　var module1 = (function (mod){
　　　　mod.m3 = function () {
　　　　　　//...
　　　　};
　　　　return mod;
　　})(module1);
```
上面的代码为module1模块添加了一个新方法m3()，然后返回新的module1模块。

**五、宽放大模式（Loose augmentation）**

在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上一节的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"。
```
　　var module1 = ( function (mod){
　　　　//...
　　　　return mod;
　　})(window.module1 || {});
```
与"放大模式"相比，＂宽放大模式＂就是"立即执行函数"的参数可以是空对象。

**六、输入全局变量**

独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。
为了在模块内部调用全局变量，必须显式地将其他变量输入模块。
```
    var module1 = (function ($, YAHOO) {
　　　　//...
　　})(jQuery, YAHOO);
```
上面的module1模块需要使用jQuery库和YUI库，就把这两个库（其实是两个模块）当作参数输入module1。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。这方面更多的讨论，参见Ben Cherry的著名文章《JavaScript Module Pattern: In-Depth》。

### Part3 - AMD规范

**七、模块的规范**

先想一想，为什么模块很重要？
因为有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。
但是，这样做有一个前提，那就是大家必须以同样的方式编写模块，否则你有你的写法，我有我的写法，岂不是乱了套！考虑到Javascript模块现在还没有官方规范，这一点就更重要了。
目前，通行的Javascript模块规范共有两种：CommonJS和AMD。我主要介绍AMD，但是要先从CommonJS讲起。

**八、CommonJS**

2009年，美国程序员Ryan Dahl创造了node.js项目，将javascript语言用于服务器端编程。

这标志"Javascript模块化编程"正式诞生。因为老实说，在浏览器环境下，没有模块也不是特别大的问题，毕竟网页程序的复杂性有限；但是在服务器端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。

node.js的模块系统，就是参照CommonJS规范实现的。在CommonJS中，有一个全局性方法require()，用于加载模块。假定有一个数学模块math.js，就可以像下面这样加载。

    var math = require('math');
然后，就可以调用模块提供的方法：

    var math = require('math');
    math.add(2,3); // 5
因为这个系列主要针对浏览器编程，不涉及node.js，所以对CommonJS就不多做介绍了。我们在这里只要知道，require()用于加载模块就行了。

**九、浏览器环境**

有了服务器端模块以后，很自然地，大家就想要客户端模块。而且最好两者能够兼容，一个模块不用修改，在服务器和浏览器都可以运行。
但是，由于一个重大的局限，使得CommonJS规范不适用于浏览器环境。还是上一节的代码，如果在浏览器中运行，会有一个很大的问题，你能看出来吗？

    var math = require('math');
    math.add(2, 3);
第二行math.add(2, 3)，在第一行require('math')之后运行，因此必须等math.js加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。这对服务器端不是一个问题，因为所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。
因此，浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是AMD规范诞生的背景。

**十、AMD**

AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

AMD也采用require()语句加载模块，但是不同于CommonJS，它要求两个参数：

    require([module], callback);

* 第一个参数[module]，是一个数组，里面的成员就是要加载的模块；
* 第二个参数callback，则是加载成功之后的回调函数。

如果将前面的代码改写成AMD形式，就是下面这样：
```
　　require(['math'], function (math) {
　　　　math.add(2, 3);
　　});
```
math.add()与math模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD比较适合浏览器环境。

目前，主要有两个Javascript库实现了AMD规范：require.js和curl.js。本系列的第三部分，将通过介绍require.js，进一步讲解AMD的用法，以及如何将模块化编程投入实战。
