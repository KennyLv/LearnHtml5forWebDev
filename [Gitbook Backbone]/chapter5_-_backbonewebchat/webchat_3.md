# Webchat (3) 前端开发

有了前面功能介绍以及整体详细设计 ，下面的开发就变得更有目的性了。
沿着上一篇文章的思路，我们先来把javascript模板建立起来，模板用来取代上一篇中html代码里的：

```
<li>
    <div class="msgtitle">the5fire 2012-04-10 23:16:00</div>
    <p>大家好！</p>
</li>
```
把它改成模板为：

```
<script type="text/template" id="item-template">

   <div class="msgtitle">
      <%=username %> <%=date %><a id="destroy">删除</a>
   </div>
   <p><%=content %></p>

</script>

```

其实模板的作用就是复用，里面多了一个删除的连接，主要是为了演示backbone的DELETE操作。
模板建立很容易，下面来建立页面端的实体类，这个更容易，因为上篇文章已经分析好了：

```
var Chat = Backbone.Model.extend({

    urlRoot:'',
    defualts: {
        content:'',
        username:'',
        date:''
    },
    clear: function(){
        this.destroy();
    }
});

```
没有看到我上一篇插曲文章的同学可能觉得奇怪，为什么urlRoot为空？这里再次重复一下，当model和collection一起使用的时候，或者更确切的说是一个model属于某一个collection时，collection的url将取代mode的urlRoot，但是你的urlRoot还必须存在。
顺着思路，在来看collection，其实简单的很，因为我这里的collection没有太多的动作要做：

```
var ChatList = Backbone.Collection.extend({

    url:'/chat/',

    model:Chat

});

```

仅此而已，是不是很简单。
然后同以前我们分析的todos一样，我们也来建立一个管理单个chat界面的类,学以致用，就是```<strong>```模仿--使用--发挥```</strong>```：

```
var ChatView = Backbone.View.extend({

    tagName:'li',

    template:_.template($('#item-template').html()),
    events:{
        'click #destroy' : 'clear'
    },

    initialize:function(){
        _.bindAll(this,'render','remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
    },

    render: function(){
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    clear: function(){
        this.model.clear();
    }
});
```

代码不肖多说。然后对应着，也要有一个整体的管理view：
```
var AppView = Backbone.View.extend({
    el:$('.main'),

    events: {
        "click #send": "say"
    },

    initialize: function() {
        _.bindAll(this,'addOne','addAll');
        this.nickname = this.$('#nickname');
        this.textarea = this.$("#content");

        chatList.bind('add', this.addOne);
        chatList.bind('reset', this.addAll);
        chatList.fetch();
        setInterval(function() {
            chatList.fetch({add: true});
        }, 5000);
    },

    addOne: function(chat) {
        //页面所有的数据都来源于server端，如果不是server端的数据，不应添加到页面上
        if(!chat.isNew()) {
            var view = new ChatView({model:chat});
            this.$(".chat_list").append(view.render().el);
            $('#screen').scrollTop($(".chat_list").height() + 200);
        }
    },

    addAll: function() {
        chatList.each(this.addOne);
    },

    say: function(event) {
        chatList.create(this.newAttributes());
        //为了满足IE和FF以及chrome
        this.textarea.text('');
        this.textarea.val('');
        this.textarea.html('');

    },


    newAttributes: function() {

        var content = this.textarea.val();
        if (content == '') {
            content = this.textarea.text();
        }

        return {
          content: content,
          username: this.nickname.val(),
          date: get_time()
        };
    }
});
```
其中有两个地方需要注意：
1. ```$('#screen').scrollTop($(".chat_list").height() + 200);```这个是为了让那个显示聊天信息的窗口滚动条始终处于最下方。</li>
2. ``` setInterval(function() {
            chatList.fetch({add: true});
}, 5000);```

这个的意思就是，每隔5秒就到到服务器取一下数据，里面的add：true参数表示，每次取回数据之后都在原有数据上累加。
剩下需要说的就是，不用忘了初始化AppView，以及在ChatView定义的上方，实例化ChatList：
```
var chatList = new ChatList;
//ChatView定义上方
var appView = new AppView;
```

到这里web端的代码就构建完毕了，从上面的实现可以发现，web端和server端的交互全部通过collection中定义的url:'/chat/'来完成的。所有的CRUD操作通过POST，GET，PUT，DELETE来完成。
