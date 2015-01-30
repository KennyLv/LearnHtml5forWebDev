# Backbone中的Router实例

关于这个router的使用，我现在依然是心存疑惑的。

每点击一次这样的链接``` <a href="#action">action</a>``` 会触发一个事件，但是url也会改变，这样刷性的话，岂不是会自动触发事件。或者这个东西只是用在单个页面的网站上，或者移动设备网站上，或者是我还不会用。

大概解释下Router： Backbone中的router，见名知意，router有路由的意思，显然这里是要控制url的。
Backbone.Router会把你连接中的#标签当做是url路径。

即便我心存疑惑，依然是要写几个例子测试一下的。毕竟实践才能解惑。

**1、一个简单的例子**
```
var AppRouter = Backbone.Router.extend({

    routes: {

        "*actions" : "defaultRoute"

    },

    defaultRoute : function(actions){

        alert(actions);

    }

});

var app_router = new AppRouter;

//需要通过调用Backbone.history.start()方法来初始化这个Router
Backbone.history.start();
```

这个Router的使用很像是django的urlconf文件提供的功能，如果你懂得django的话。

在页面上需要有这样的a标签：```<a href="#actions">testActions</a>```

**2、routes映射传参数**
```
var AppRouter = Backbone.Router.extend({

    routes: {

        "posts/:id" : "getPost",

        "*actions" : "defaultRoute"

    },

    getPost: function(id) {

        alert(id);

    },

    defaultRoute : function(actions){

        alert(actions);

    }

});

var app_router = new AppRouter;

Backbone.history.start();
```
对应的页面上应该有一个超链接：```<a href="#/posts/120">Post 120</a>```

从上面已经可以看到匹配#标签之后内容的方法，有两种：一种是用“:”来把#后面的对应的位置作为参数；还有一种是“*”，它可以匹配所有的url，下面再来演练一下。

```
var AppRouter = Backbone.Router.extend({

    routes: {

        "posts/:id" : "getPost",

        "download/*path": "downloadFile",  //对应的链接为<a href="#/download/user/images/hey.gif">download gif</a>

        ":route/:action": "loadView",      //对应的链接为<a href="#/dashboard/graph">Load Route/Action View</a>

        "*actions" : "defaultRoute"

    },

    getPost: function(id) {

        alert(id);

    },

    defaultRoute : function(actions){

        alert(actions);

    },

    downloadFile: function( path ){

                    alert(path); // user/images/hey.gif

                },

                loadView: function( route, action ){

                    alert(route + "_" + action); // dashboard_graph

                }

    });

var app_router = new AppRouter;

Backbone.history.start();
```

总结，router的使用看起来能够去除通过对dom节点的绑定来触发事件的那种繁琐，但唯一让我觉得不爽的就是点击之后如果再刷新，就会重新执行一遍对应的方法，因为url已经变了。

或许这个也是可以解决的问题，只是我还没有发现。

另外，在其他的模块中（指：model,view,collection），也可以通过使用routes:{}来根据链接触发函数。


**完整的代码**

```
<!DOCTYPE html>
<html>
<head>
    <title>the5fire-backbone-router</title>
</head>
<body>
    <a href="#/posts/120">Post 120</a>
<a href="#/download/user/images/hey.gif">download gif</a>
<a href="#/dashboard/graph">Load Route/Action View</a>
</body>
<script src="http://backbonejs.org/test/vendor/jquery.js"></script>
<script src="http://backbonejs.org/test/vendor/underscore.js"></script>
<script src="http://documentcloud.github.com/backbone/backbone-min.js"></script>
<script>
    (function ($) {
        //Backbone中的router，见名知意，router有路由的意思，显然这里是要控制url的。
        //Backbone.Router会把你连接中的#标签当做是url路径
        /**
        //1、来看一个简单的例子
        var AppRouter = Backbone.Router.extend({
            routes: {
                "*actions" : "defaultRoute"
            },
            defaultRoute : function(actions){
                alert(actions);
            }
        });

        var app_router = new AppRouter;

        Backbone.history.start();


        //2、既然是对url进行匹配那么它应该不仅仅只是简单的静态匹配，应该具有传递参数的功能，所以下面再来一个动态的router的例子.
        var AppRouter = Backbone.Router.extend({
            routes: {
                "posts/:id" : "getPost",
                "*actions" : "defaultRoute"
            },
            getPost: function(id) {
                alert(id);
            },
            defaultRoute : function(actions){
                alert(actions);
            }
        });

        var app_router = new AppRouter;

        Backbone.history.start();
        **/
        //从上面已经可以看到匹配#标签之后内容的方法，有两种：一种是用“:”来把#后面的对应的位置作为参数；还有一种是“*”，它可以匹配所有的url，下面再来演练一下。
        var AppRouter = Backbone.Router.extend({
            routes: {
                "posts/:id" : "getPost",
                "download/*path": "downloadFile",  //对应的链接为<a href="#/download/user/images/hey.gif">download gif</a>
                ":route/:action": "loadView",      //对应的链接为<a href="#/dashboard/graph">Load Route/Action View</a>
                "*actions" : "defaultRoute"
            },
            getPost: function(id) {
                alert(id);
            },
            defaultRoute : function(actions){
                alert(actions);
            },
            downloadFile: function( path ){
                alert(path); // user/images/hey.gif
            },
            loadView: function( route, action ){
                alert(route + "_" + action); // dashboard_graph
            }
        });

        var app_router = new AppRouter;

        Backbone.history.start();

    })(jQuery);
    </script>

</html>

```









