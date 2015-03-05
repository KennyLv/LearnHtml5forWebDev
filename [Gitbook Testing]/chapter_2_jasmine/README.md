## jasmine介绍

Jasmine是一个用来编写Javascript测试的框架，它不依赖于任何其它的javascript框架。

jasmine的结构很简单：
```
describe("A suite", function() {
  var foo;
  beforeEach(function() {
    foo = 0;
    foo += 1;
  });

  afterEach(function() {
    foo = 0;
  });

  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});
```
每个测试都在一个测试集中运行，Suite就是一个测试集，用describe函数封装。 Spec表示每个测试用例，用it函数封装。通过expect函数，作为程序断言来判断相等关系。setup过程用beforeEach函数封装，tearDown过程用afterEach封装。

用过Java中JUnit的同学，看到这种对应关系，应该就会明白jasmine就是JUnit的Javascript重写版。

## jasmine安装

安装jasmine类库时，让我们利用bower，一键搞定。bower的使用介绍，请参考文章：[bower解决js的依赖管理](http://blog.fens.me/nodejs-bower-intro/)。
```
#查找jasmine项目
~ D:\workspace\javascript\jasmine>bower search jasmine

#安装jasmine类库
~ D:\workspace\javascript\jasmine>bower install jasmine

```

##jasmine环境配置

jasmine运行需要4个部分：

1. 运行时环境：我们这里基于chrome浏览器，通过HTML作为javascript载体
2. 源文件：用于实现某种业务逻辑的文件，就是我们平时写的js脚本
3. 测试文件：符合jasmineAPI的测试js脚本
4. 输出结果：jasmine提供了基于网页的输出结果

下面让我开始jasmine：

```
# test.html

<html>
<head>
    <title>jasmine test</title>
    <link rel="stylesheet" type="text/css" href="bower_components/jasmine/lib/jasmine-core/jasmine.css">
    <script type="text/javascript" src="bower_components/jasmine/lib/jasmine-core/jasmine.js"></script>
    <script type="text/javascript" src="bower_components/jasmine/lib/jasmine-core/jasmine-html.js"></script>
</head>
<body>
    <h1>jasmine test</h1>
    <script type="text/javascript" src="src.js"></script>
    <script type="text/javascript" src="test.js"></script>
    <script type="text/javascript" src="report.js"></script>
</body>
</html>
```
我们看到页面上面有5个javascript的导入：
* jasmine.js：核心文件用于执行单元测试的类库
* jasmine-html.js:用于显示单元测试的结果的类库
* src.js:我们自己的业务逻辑的js
* test.js:单元测试的js
* report.js:用于启动单元测试js

jasmine.js,jasmine-html.js是系统类库，直接引入。

src.js是实现业务逻辑的文件，我们定义sayHello的函数
```
# src.js

function sayHello(name){
    return "Hello " + name;
}
```
test.js对源文件进行单元测试
```
# test.js

describe("A suite of basic functions", function() {
    var name;
    it("sayHello", function() {
        name = "Conan";
        var exp = "Hello Conan";
        expect(exp).toEqual(sayHello(name));
    });
});
```

** report.js，是启动脚本，写法是固定的。**
```
# report.js

(function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;

    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }

})();
```
> jasmine 2.0版本后用户不用再自己写启动文件了, 在jasmine的lib目录下自带有一个启动文件boot.js。

## jasmine使用

1). 测试先行

测试先行，就是未写现实，先写用例。有一个需求，要实现单词倒写的功能。如：”ABCD” ==> “DCBA” , 我们编辑test.js，增加一个测试用例
```
# test.js

it("reverse word",function(){
    expect("DCBA").toEqual(reverse("ABCD"));
});
```

执行这个页面，单元测试失败，提示没有reverse函数。

2). 编辑src.js，增加reverse函数
```
function reverse(name){
    return "DCBA";
}
```
执行页面，单元测试成功！单元测试成功，是不是能说明我们完成了“单词倒写”的功能呢？答案是不确定的。如果想保证功能是正确性，我们需要进行更多次的验证。

3). 编辑test.js，继续增加测试用例
```
it("reverse word",function(){
    expect("DCBA").toEqual(reverse("ABCD"));
    expect("Conan").toEqual(reverse("nanoC"));
});
```
刷新页面，又提示单元测试失败，因为我们希望输入是”Conan”，输出是”nanoC”，但是功能代码返回是”DCBA”，显然业务逻辑写的是不对的。

4). 修改src.js，修改reverse函数
```
unction reverse(name){
    return name.split("").reverse().join("");
}
```
再次刷新页面，单元测试成功！！

这是敏捷开发中提倡的“测试先行”的案例，对于产品级的代码，我们真的应该要高质量控制。


## jasmine语法实践

以下内容是对jasmine语法的介绍，都在test.js中实现。做一个嵌套的describe(“A suite of jasmine’s function”)

学习Jasmine记住四个核心的概念即可：分组、用例、期望、匹配。四个核心概念分别对应Jasmine的四种函数，简要说明如下：
1. describe(string,function)这个函数表示分组，也就是一组测试用例。
2. it(string,function)这个函数表示测试用例。
3. expect(expression)表示期望expression这个表达式具有某个值或者具有某种行为。
4. to***(arg)这个函数表示匹配。

> 对于同一组(describe)中的多个测试用例(it)，可以做一些重复性的动作，比如在每一个测试用例运行之前把某个变量+1等等。因此，Jasmine提供了beforeEach和afterEach两个函数，这也是为什么要有分组这个概念的原因。

#### 对断言表达式的使用
```
describe("A suite of jasmine's function", function() {
    describe("Expectations",function(){
        it("Expectations",function(){
            expect("AAA").toEqual("AAA");
            expect(52.78).toMatch(/\d*.\d\d/);
            expect(null).toBeNull();
            expect("ABCD").toContain("B");
            expect(52,78).toBeLessThan(99);
            expect(52.78).toBeGreaterThan(18);

            var x = true;
            var y;
            expect(x).toBe(true);
            expect(x).toBeDefined();
            expect(y).toBeUndefined();
            expect(x).toBeTruthy();
            expect(!x).toBeFalsy();

            var fun = function() { return a + 1;};
            expect(fun).toThrow();
        });
    });
});
```
#### 对开始前和使用后的变量赋值
```
describe("Setup and Teardown",function(){
    var foo;
    beforeEach(function() {
        foo = 0;
        foo += 1;
    });
    afterEach(function() {
        foo = 0;
    });

    it("is just a function, so it can contain any code", function() {
        expect(foo).toEqual(1);
    });

    it("can have more than one expectation", function() {
        expect(foo).toEqual(1);
        expect(true).toEqual(true);
    });
});
```
#### Disabling Suites : 对忽略suite的声明
```
xdescribe("Disabling Specs and Suites", function() {
    it("Disabling Specs and Suites",function(){
        expect("AAA").toEqual("AAA");
    });
});
```
#### Asynchronous Support : 对异步程序的单元测试
```
describe("Asynchronous Support",function(){
    var value, flag;
    it("Asynchronous Support", function() {
        runs(function() {
            flag = false;
            value = 0;
            setTimeout(function() {
                flag = true;
            }, 500);
        });
        waitsFor(function() {
            value++;
            return flag;
        }, "The Value should be incremented", 750);

        runs(function() {
            expect(value).toBeGreaterThan(0);
        });
    });
});
```
我们成功地对Javascript完成各种的单元测试，下面是测试报告。

##TODO :
* Custom equality
* 内置匹配函数与自定义匹配函数（Custom matcher）

Spies

* Matching Anything with
* Partial Matching with

* Mocking the JavaScript Timeout Functions

## jasmime测试套件


对于jQuery这种DOM操作的框架，有时难于分离view逻辑，以及ajax这种外部资源的mock，所以比较难于实施对jQuery程序的TDD开发。jasmine测试框架为了解决这些问题，开发了两个插件jasmine-jquery和jasmine-ajax。

#### jasmine-jquery

jasmine-jQuery主要解决加载测试所需的DOM元素，为单元测试构建前置环境。

jasmine-jQuery加载DOM方法：
```
jasmine.getFixtures().fixturesPath = 'base path';
loadFixtures('myfixture.html');
jasmine.getFixtures().load(...);
```
这里的loadFixtures需要真实ajax获取html fixtures所以我们需要提前host html fixtures。

jasmine-jQuery还框架了一些有用的matchers，如toBeChecked， toBeDisabled， toBeFocused，toBeInDOM……

#### jasmine-ajax

jasmine-ajax则是对于一般ajax测试的mock框架，其从底层xmlhttprequest实施mock。

所以让我们能偶很容易实施对于jQuery的$.ajax,$.get... 的mock。








