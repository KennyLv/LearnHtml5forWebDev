# Backbone中的View实例

Backbone的view是用来显示你的model中的数据到页面的，同时它也可用来监听DOM上的事件然后做出响应。

先要给出一个页面的大体代码，下面的所有试验代码都要放到这里面：

```
<!DOCTYPE html>
<html>
<head>
    <title>the5fire-backbone-view</title>
</head>
<body>
    <div id="search_container"></div>

    <script type="text/template" id="search_template">
        <label><%= search_label %></label>
        <input type="text" id="search_input" />
        <input type="button" id="search_button" value="Search" />
    </script>
</body>
<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>-->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="http://underscorejs.org/underscore.js"></script>
<!--<script src="http://ajax.cdnjs.com/ajax/libs/backbone.js/0.3.3/backbone-min.js"></script>-->
<script src="http://documentcloud.github.com/backbone/backbone.js"></script>
<script>
(function ($) {
           //此处添加下面的试验代码
})(jQuery);
</script>
</html>
```

**1、一个简单的view**

```
SearchView = Backbone.View.extend({

    initialize: function(){

        alert('init a SearchView');

    }

});

var searchView = new SearchView();
```

是不是觉得很没有技术含量，所有的模块定义都一样。

**2、 el属性**

这个属性用来引用DOM中的一些元素，每一个Backbone的view都会有这么个属性，
如果没有显示声明，Backbone会默认的构造一个，表示一个空的div元素

```
SearchView = Backbone.View.extend({

    initialize: function(){

        alert('init a SearchView');

    }

});

var searchView = new SearchView({el: $("#search_container")});
```

接着来看这个el的应用，首先注意标签中的这个标签，这是我们定义的一个模板。

```
SearchView = Backbone.View.extend({

    initialize: function(){

        //this.render();

    },

    render: function() {

        //使用underscore这个库，来编译模板
        var template = _.template($("#search_template").html(),{});

        //加载模板到对应的el属性中
        $(this.el).html(template);

    }

});

var searchView = new SearchView({el: $("#search_container")});
searchView.render();  //这个reander的方法可以放到view的构造函数中

```

运行页面之后，会发现script模板中的html代码已经添加到了我们定义的div中。

> [这里有一个错误，因为这个例子里没有传入search_label这个变量，所以你运行的时候要把html的模板中的那个变量改掉才行。]


**3、再来看对DOM中元素事件的绑定，很简单**

```
SearchView = Backbone.View.extend({

    initialize: function(){

        this.render();

    },

    render: function() {
        //使用underscore这个库，来编译模板
        var template = _.template($("#search_template").html(),{});

        //加载模板到对应的el属性中
       $(this.el).html(template);
    },

    events:{  //就是在这里绑定的

        'click input[type=button]' : 'doSearch'
        //定义类型为button的input标签的点击事件，触发函数doSearch

    },

    doSearch: function(event){

        alert("search for " + $("#search_input").val());

    }

});

var searchView = new SearchView({el: $("#search_container")});
```
自己运行下，是不是很简答，比写$("input[type=button]").bind('click',function(){})好看多了吧。

**4、view中的模板**

如果你用过django模板的话，你应该会想到前面提到的模板和django模板是不是有同样的功能，既然是模板，那就应该能传入数据。

没错了，这个和django的使用一样，可以在模板中定义变量，然后通过字典的方式传递进去

注意script模板的变化

```
SearchView = Backbone.View.extend({

    initialize: function(){

        this.render();

    },

    render: function() {

        //使用underscore这个库，来编译模板
        var template = _.template($("#search_template").html(),{search_label: "the5fire search"});

        //加载模板到对应的el属性中
        $(this.el).html(template);
    },

    events:{  //就是在这里绑定的

        'click input[type=button]' : 'doSearch'
        //定义类型为button的input标签的点击事件，触发函数doSearch

    },

    doSearch: function(event){

        alert("search for " + $("#search_input").val());

    }

});

var searchView = new SearchView({el: $("#search_container")});
```

再次运行，有木有觉得这个东西对dom的操作还是很好玩的。别激动，再来稍微扩展一下

对于实际应用来说，页面数据的变化需要同步到服务器端，最理想的方法，只是回传变化的数据就ok，然后修改页面上对应的数据，而不是刷新页面。
```
SearchView = Backbone.View.extend({

    initialize: function(){

        this.render('the5fire');

    },

    render: function(search_label) {
        //使用underscore这个库，来编译模板
        var template = _.template($("#search_template").html(),{search_label: search_label});

        //加载模板到对应的el属性中
        $(this.el).html(template);
    },

    events:{  //就是在这里绑定的

        'click input[type=button]' : 'doChange'

    },

    doChange: function(event){

        //通过model发送数据到服务器

        this.render('the5fire' + $("#search_input").val());

    }

});

var searchView = new SearchView({el: $("#search_container")});
```
这是一个比较牵强的例子，但是如果加上model的使用，效果就会好很多，通过view和model可以使得业务和数据真正的分离。

总之，view的主要应用就是绑定事件，处理业务，渲染页面。

前段时间不方便上网，一直看到有网友的留言，来不及修改内容。其实不是错误，只是我用了一个较老的backbone版本。






