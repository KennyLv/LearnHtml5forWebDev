# Chapter2 - HelloWorld in Backbone

先来说一下这个helloworld的功能：

在页面上有一个报道的按钮，点击弹出输入框，输入内容，确认，最后内容会加到页面上。

```
<!DOCTYPE html>
<html>
<head>
        <title>the5fire.com-backbone.js-Hello World</title>
</head>
<body>
<button id="check">报到</button>
<ul id="world-list">
</ul>
<a href="http://www.the5fire.com">更多教程</a>
</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
<script src="http://documentcloud.github.com/underscore/underscore-min.js"></script>
<script src="http://documentcloud.github.com/backbone/backbone-min.js"></script>
<script>
(function ($) {
        World = Backbone.Model.extend({
                //创建一个World的对象，拥有name属性
                name: null
        });

        Worlds = Backbone.Collection.extend({
                //World对象的集合
                initialize: function (models, options) {
                        this.bind("add", options.view.addOneWorld);
                }
        });

        AppView = Backbone.View.extend({
                el: $("body"),
                initialize: function () {
                        //构造函数，实例化一个World集合类，并且以字典方式传入AppView的对象
                        this.worlds = new Worlds(null, { view : this })
                },
                events: {
                        "click #check":  "checkIn",   //事件绑定，绑定Dom中id为check的元素
                },
                checkIn: function () {
                        var world_name = prompt("请问，您是哪星人?");
                        if(world_name == "") world_name = '未知';
                        var world = new World({ name: world_name });
                        this.worlds.add(world);
                },
                addOneWorld: function(model) {
                        $("#world-list").append("<li>这里是来自 <b>" + model.get('name') + "</b> 星球的问候：hello world！</li>");
                }
        });
        //实例化AppView
        var appview = new AppView;
})(jQuery);
</script>
</html>

```
我认为代码是直观的，这里面涉及到backbone的三个部分：

 - model代表一个数据模型
 - collection是模型的一个集合
 - view是用来处理页面以及简单的页面逻辑的。


