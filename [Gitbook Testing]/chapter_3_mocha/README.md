## Mocha

Mocha是一个基于node.js和浏览器的集合各种特性的Javascript测试框架，并且可以让异步测试也变的简单和有趣。

Mocha的测试是连续的，在正确的测试条件中遇到未捕获的异常时，会给出灵活且准确的报告。

特性：
* 支持多种node的assert libs
* 也支持直接在browser上跑Javascript代码测试

* 同时支持异步和同步的测试
* 支持简单异步，包括 promises
* 支持异步测试超时

* 同时支持多种方式导出结果
* 测试覆盖报告
* 支持不同字符串比较
* 提供 javascript API 来运行测试

* 适当的退出状态，支持 CI
* non-ttys 自动检测和禁用颜色
* 支持 node debugger
* TextMate 绑定
* ...


####安装

通过npm来安装：``` $ npm install -g mocha ```

#### 断言

Mocha允许你使用任何你喜欢的第三方断言库，只要它能抛出错误，那么它就能工作！例如你可以使用should.js、node自带的assert等等。下面是常见node或者浏览器的断言库列表：

* [should.js](https://github.com/visionmedia/should.js) BDD style shown throughout these docs
* [expect.js ](https://github.com/LearnBoost/expect.js)expect() style assertions
* [chai](http://chaijs.com/) expect(), assert() and should style assertions
* [better-assert](https://github.com/tj/better-assert) c-style self-documenting assert()

#### 示例
```
$ npm install -g mocha
$ mkdir test
$ $EDITOR test/test.js

var assert = require("assert");
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

$  mocha

# result
.

✔ 1 test complete (1ms)

```

#### 测试同步代码 - Synchronous

当测试同步代码，将忽略回调，Mocha会自动进行下一个测试。
```
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});
```

#### 测试异步代码 - Asynchronous

利用Mocha测试异步代码再简单不过了，当测试完成时，只需调用回调。

通过给it()添加回调函数（通常命名为done）可以告知Mocha需要等待异步测试结束:

```
fs = require('fs');
describe('File', function(){
    describe('#readFile()', function(){
        it('should read test.ls without error', function(done){
            fs.readFile('test.ls', function(err){
                if (err) throw err;
                done();
            });
        })
    })
})
```
**done ()**

按照瀑布流编程习惯，取名done是表示你回调的最深处，也就是结束写嵌套回调函数。但对于回调链来说done实际上意味着告诉mocha从此处开始测试，一层层回调回去。

这里可能会有个疑问，假如我有两个异步函数（两条分叉的回调链），那我应该在哪里加done()呢？实际上这个时候就不应该在一个it里面存在两个要测试的函数，事实上一个it里面只能调用一次done，当你调用多次done的话mocha会抛出错误。

所以应该类似这样：
```
fs = require('fs');
describe('File', function(){
    describe('#readFile()', function(){
        it('should read test.ls without error', function(done){
            fs.readFile('test.ls', function(err){
                if (err) throw err;
                done();
            });
        })
        it('should read test.js without error', function(done){
            fs.readFile('test.js', function(err){
                if (err) throw err;
                done();
            });
        })
    })
})
```
为了更方便的使用，回调函数done()支持接收一个错误，所以我们可以直接这样来使用它：
```
describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User('Luna');
            user.save(done);
        });
    });
});
```
你也可以返回一个promise来代替使用回调函数done()。当你测试的API返回promise而不是执行回调函数时，这将会非常好用。 例子使用了[ **Chai as Promised**  ](https://github.com/domenic/chai-as-promised/)作为promise断言
```
beforeEach(function() {
    return db.clear().then(function() {
        return db.save([tobi, loki, jane]);
    });
});

describe('#find()', function() {
    it('respond with matching records', function() {
        return db.find({ type: 'User' }).should.eventually.have.length(3);
    });
});
```
> 注意，你也可以在任意文件中加入“全局”级别的钩子，例如在describe()外面添加beforeEach()，这样回调函数就会在每一个测试用例前执行而不管测试用例是否在这个文件中。产生这样的结果是因为Mocha运行在自己的全局匿名Suite中。

> 所有的钩子（before()、after()、beforeEach()、afterEach()）都同时支持同步和异步，行为表现也类似于通常的测试用例。
```
beforeEach(function() {
    console.log('before every test')
});
```

#### 挂起测试 - Pending

即省去测试细节只保留函数体。一般适用情况比如负责测试框架的写好框架让组员去实现细节，或者测试细节尚未完全正确实现先注释以免影响全局测试情况。这种时候mocha会默认该测试pass。

没有回调函数的测试用例：
```
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present');
    });
});
```
#### 独占测试 & 包含测试 - Exclusive && Inclusive

**独占测试**

独占这个特性允许你像下面例子那样通过添加.only()来只执行指定的测试场景：
```
describe('Array', function() {
    describe.only('#indexOf()', function() {
        ...
    });
});
```
或者指定的测试用例：
```
describe('Array', function() {
    describe('#indexOf()', function() {
        it.only('should return -1 unless present', function() {

        });

        it('should return the index when present', function() {

        });
    });
});
```
注意，目前只考虑使用最多一个.only()，这能有效的达到--grep的效果。

**包含测试**

这个特性类似于.only，你可以通过添加.skip()来告诉Mocha忽略掉这个测试场景和测试用例。这会让它们被挂起，有助于在你忘记去掉注释的时候跳过那些测试。
```
describe('Array', function() {
    describe.skip('#indexOf()', function() {
        ...
    });
});
```
对测试用例同样适用：
```
describe('Array', function() {
    describe('#indexOf()', function() {
        it.skip('should return -1 unless present', function() {

        })

        it('should return the index when present', function() {

        });
    });
});
```
> 上面的代码只会有一个test complete， 只有only的会被执行，另一个会被忽略掉。

> 每个it 回调函数里只能有一个only。如果是it.skip ，那么该case就会被忽略。

> only和skip共用没有什么实际意义，因为only的作用会把skip屏蔽掉。


#### 指定方案超时时间

方案级的超时时间会对整个测试方案生效，也可以通过this.timeout(0)来关闭。如果其内部的测试方案和测试用例不覆盖这个值，那么这个值将被继承。
```
describe('a suite of tests', function() {
    this.timeout(500);

    it('should take less than 500ms', function(done) {
        setTimeout(done, 300);
    });

    it('should take less than 500ms as well', function(done) {
        setTimeout(done, 200);
    });
});
```
#### 指定测试超时时间

测试可以指定超时时间，也可以通过this.timeout(0)来关闭所有的超时时间：
```
it('should take less than 500ms', function(done) {
    this.timeout(500);
    setTimeout(done, 300);
});
```

### 最佳实践

```
# mocha(1)默认会使用./test/*.js这个路径模式，这也通常是你放测试用例的好地方。

test/*
```

**Makefiles** - 对开发者友好，在Makefile中添加一个make test，不要让他们在你的文档中到处寻找如何运行测试用例：
```
test:
./node_modules/.bin/mocha --reporter list

.PHONY: test
```

### 执行Mocha的测试

执行测试：```$ make test```

执行所有测试，包括接口：```$ make test-all```

更改监控器：```$ make test REPORTER=list```

### 接口

> mocha默认的模式是Behavior Driven Develop (BDD)，要想执行TDD的test的时候需要加上参数，如
```mocha -u tdd test.js```

> * beforeEach会对当前describe下的所有子case生效。
* before和after的代码没有特殊顺序要求。
* 同一个describe下可以有多个before，执行顺序与代码顺序相同。
* 同一个describe下的执行顺序为before, beforeEach, afterEach, after
* 当一个it有多个before的时候，执行顺序从最外围的describe的before开始，其余同理。






**BDD** "BDD"接口提供了describe()、it()、before()、after()、beforeEach()和afterEach可使用。
```
describe('Array', function() {
    before(function() {
        // ...
    });

    describe('#indexOf()', function() {
        it('should return -1 when not present', function() {
            [1,2,3].indexOf(4).should.equal(-1);
        });
    });
});
```
**TDD** "TDD"接口提供了suite()、test()、setup()和teardown()可使用。
```
suite('Array', function() {
    setup(function() {
        // ...
    });

    suite('#indexOf()', function() {
        test('should return -1 when not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
```

**Exports** The "exports" interface is much like Mocha's predecessor expresso. The keys before, after, beforeEach, and afterEach are special-cased, object values are suites, and function values are test-cases.
```
module.exports = {
    before: function() {
        // ...
    },

    'Array': {
        '#indexOf()': {
            'should return -1 when not present': function() {
                [1,2,3].indexOf(4).should.equal(-1);
            };
        };
    };
};
```

**Qunit** The qunit-inspired interface matches the "flat" look of QUnit where the test suite title is simply defined before the test-cases.

**Require** The require interface allows you to require the describe and friend words directly using require and call them whatever you want. This interface is also useful if you want to avoid global variables in your tests.
```
var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').assertions;
var assert = require('assert');

testCase('Array', function() {
    pre(function() {
        // ...
    });

    testCase('#indexOf()', function() {
        assertions('should return -1 when not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});
```


#### 监控器 - OUTPUT

Mocha 的监控器可以适应控制台窗口，并且当标准输入流不是和 tty 关联的时候，它总是会禁用 ansi-escape 着色。

* Dot Matrix - The "dot" matrix reporter is simply a series of dots that represent test cases, failures highlight in red, pending in blue, slow as yellow.

* Spec - The "spec" reporter outputs a hierarchical view nested just as the test cases are.

* Nyan - The "nyan" reporter is exactly what you might expect:

* TAP - The TAP reporter emits lines for a [Test-Anything-Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) consumer.

* Landing Strip - The Landing Strip reporter is a gimmicky test reporter simulating a plane landing :) unicode ftw

* List- The "List" reporter outputs a simple specifications list as test cases pass or fail, outputting the failure details at the bottom of the output.

* Progress - The progress reporter implements a simple progress-bar:

* JSON - The JSON reporter outputs a single large JSON object when the tests have completed (failures or not).

* JSON Stream - The JSON Stream reporter outputs newline-delimited JSON "events" as they occur, beginning with a "start" event, followed by test passes or failures, and then the final "end" event.

* JSONCov - The JSONCov reporter is similar to the JSON reporter, however when run against a library instrumented by [node-jscoverage](https://github.com/tj/node-jscoverage) it will produce coverage output.

* HTMLCov - The HTMLCov reporter extends the JSONCov reporter. The library being tested should first be instrumented by [node-jscoverage](https://github.com/tj/node-jscoverage), this allows Mocha to capture the coverage information necessary to produce a single-page HTML report. Click to view the current Express test coverage report. For an integration example view the mocha test coverage support [commit](https://github.com/strongloop/express/commit/b6ee5fafd0d6c79cf7df5560cb324ebee4fe3a7f) for Express.

* Min - The "min" reporter displays the summary only, while still outputting errors on failure. This reporter works great with --watch as it clears the terminal in order to keep your test summary at the top.

* Doc - The "doc" reporter outputs a hierarchical HTML body representation of your tests, wrap it with a header, footer, some styling and you have some fantastic documentation! For example suppose you have the following JavaScript:
```
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        });
    });
});
```
The command mocha --reporter doc array would yield:
```
<section class="suite">
    <h1>Array</h1>
    <dl>
        <section class="suite">
            <h1>#indexOf()</h1>
            <dl>
                <dt>should return -1 when the value is not present</dt>
                <dd><pre><code>[1,2,3].indexOf(5).should.equal(-1); [1,2,3].indexOf(0).should.equal(-1);</code></pre></dd>
            </dl>
        </section>
    </dl>
</section>
```
The [SuperAgent](http://visionmedia.github.io/superagent/docs/test.html) request library test documentation was generated with Mocha's doc reporter using this simple make target:
```
test-docs:
make test REPORTER=doc \
| cat docs/head.html - docs/tail.html \
> docs/test.html
```
View the entire Makefile for reference.

* XUnit - Documentation needed.

* TeamCity - Documentation needed.

* Markdown -The "markdown" reporter generates a markdown TOC and body for your test suite. This is great if you want to use the tests as documentation within a Github wiki page, or a markdown file in the repository that Github can render.

* HTML - The HTML reporter is currently the only browser reporter supported by Mocha



