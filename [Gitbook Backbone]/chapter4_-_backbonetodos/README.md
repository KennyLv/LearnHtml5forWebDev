# Chapter4 - TODOS实例分析

经过前面的几篇文章，backbone中的model，collection，router，view，都简单的讲了一下，我觉得看完这几篇文章，你应该达到的水平，或者说我要达到的目的就是：已经能够在自己的web项目或者是平时的练习中用的上backbone了。


其实对于一个web开发老手来说，基本上看完前面的内容，你已经可以把backbone的使用和自己的开发经验结合起来进行应用了，要想更进一步的话需要去看backbone的官方文档，或者去看官方实例。


这里我就backbone官网上的实例todos进行下分析，毕竟人家自己的东西，自己写出来应该能够把backbone的特性发挥的淋漓尽致，并且代码应该也是足够优秀的，不然也会放出来让大家参考。


好了，废话这么多，下面开始正题。todos的代码这里下载：https://github.com/documentcloud/backbone/


首先应该来看下这个Todos有哪些功能：

1、添加任务。

2、修改任务（包括内容，状态）。

3、删除任务。

4、任务完成情况统计。

总体上就这四项功能。



这个项目仅仅是在web端运行的，没有服务器进行支持，所以项目中使用了一个叫做backbone-localstorage的js库，用来把数据存储到前端。



因为backbone为mvc模式，根据对这种模式的使用经验，我们应该从分析其数据模型开始。当然，你也可以从其他地方入手。

**一、Model与Controller**

这里我们显然是可以看到它的源代码的，所以直接来看其model层，：

```
  /**
   *基本的Todo模型，属性为：content,order,done。
  **/

  var Todo = Backbone.Model.extend({
    // 设置默认的属性
    defaults: {
      content: "empty todo...",
      done: false
    },

    //确保每一个content都不为空
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content});
      }
    },

    // 将一个任务的完成状态置为逆状态
    toggle: function() {
      this.save({done: !this.get("done")});
    },

    //从localStorage中删除一个条目
    clear: function() {
      this.destroy();
    }
  });

```

这段代码是很好理解的，这个Todo显然就是对应页面上的每一个任务条目。

那么显然应该有一个collection来统治（管理）所有的任务，所以再来看collection：
```
  /**
   *Todo的一个集合，数据通过localStorage存储在本地。
   **/

  var TodoList = Backbone.Collection.extend({

    //设置Collection的模型为Todo
    model: Todo,

    //存储到本地，以todos-backbone命名的空间中
    localStorage: new Store("todos-backbone"),

    //获取所有已经完成的任务数组
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    //获取任务列表中未完成的任务数组
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    //获得下一个任务的排序序号，通过数据库中的记录数加1实现。
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    //Backbone内置函数，根据todo对象的加入顺序进行排列
    comparator: function(todo) {
      return todo.get('order');
    }
  });
```

collection的主要功能有以下几个：

1. 按序存放Todo对象;
2. 获取完成的任务数目;
3. 获取未完成的任务数目;
4. 获取下一个要插入数据的序号。


这里面有三个新的函数需要解释下：

> 第一个是comparator，这是backbone的内置函数，起作用就是collection中数据的排序依据。文档参考这里：http://documentcloud.github.com/backbone/#Collection-comparator

> 第二个是获取完成任务数目时调用的this.filter 这个函数，它是underscore的内置函数，作用是遍历当前对象，然后过滤出对象中指定内容为True的对象，并将这些对象放到数组中返回。
参考文档：http://documentcloud.github.com/underscore/#filter

> 第三个是获取未完成任务数据是调用的 this.without.apply(this, this.done())这个函数，without也是underscore里面的函数。而后面的那个apply是javascript的内置函数，作用是把当前的上下文传入到函数中。这段代码的意思其实就是从this（也就是collection中），排除已经完成的任务（this.done()）,返回数组。
参考：http://stackoverflow.com/questions/9137398/backbone-js-todo-collection-what-exactly-is-happening-in-this-return-stateme

**二、view的应用 **

我们把todos这个实例的数据模型进行了简单的分析，有关于数据模型的操作也都知道了。接着我们来看剩下的两个view的模型，以及它们对页面的操作。

首先要分析下，这个俩view是用来干嘛的。按照自己的想法，一个页面上的操作，直接用一个view来搞定不就行了吗，为何要用两个呢？

我觉得这就是新手和老手的主要区别之一，喜欢在一个方法里面搞定一切，随着时间的推移，再逐渐重构，让代码变得灵活可扩展。但既然我们拿到一个成熟的代码，就应该吸取其中的精华。我觉得这里面的精华就是，将数据的展示和对数据的操作进行分离，也就是现在代码里面TodoView和AppView。

前者的作用是展示数据模型中的数据到界面，并对数据本身进行管理;后者是对整体的一个控制，如所有数据的显示（调用TodoView），添加一个任务、统计多少完成任务等。

有了上面的分析，让我们来一起看下代码：

```
// 首先是创建一个全局的Todo的collection对象

  var Todos = new TodoList;

  // 先来看TodoView，作用是控制任务列表
  var TodoView = Backbone.View.extend({

    //下面这个标签的作用是，把template模板中获取到的html代码放到这标签中。
    tagName:  "li",

    // 获取一个任务条目的模板
    template: _.template($('#item-template').html()),

    // 为每一个任务条目绑定事件
    events: {
      "click .check"              : "toggleDone",
      "dblclick label.todo-content" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter",
      "blur .todo-input"          : "close"
    },

    //在初始化设置了todoview和todo的以一对一引用，这里我们可以把todoview看作是todo在界面的映射。
    initialize: function() {
      _.bindAll(this, 'render', 'close', 'remove');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);   //这个remove是view的中的方法，用来清除页面中的dom
    },

    // 渲染todo中的数据到 item-template 中，然后返回对自己的引用this
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.todo-input');
      return this;
    },

    // 控制任务完成或者未完成
    toggleDone: function() {
      this.model.toggle();
    },

    // 修改任务条目的样式
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // 关闭编辑界面，并把修改内容同步到界面
    close: function() {
      this.model.save({content: this.input.val()}); //会触发change事件
      $(this.el).removeClass("editing");
    },

    // 按下回车之后，关闭编辑界面
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // 移除对应条目，以及对应的数据对象
    clear: function() {
      this.model.clear();
    }
  });

//再来看AppView，功能是显示所有任务列表，显示整体的列表状态（如：完成多少，未完成多少）
//以及任务的添加。主要是整体上的一个控制
  var AppView = Backbone.View.extend({

    //绑定页面上主要的DOM节点
    el: $("#todoapp"),

    // 在底部显示的统计数据模板
    statsTemplate: _.template($('#stats-template').html()),

    // 绑定dom节点上的事件
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted",
      "click .mark-all-done": "toggleAllComplete"
    },

    //在初始化过程中，绑定事件到Todos上，当任务列表改变时会触发对应的事件。最后把存在localStorage中的数据取出来。
    initialize: function() {
      //下面这个是underscore库中的方法，用来绑定方法到目前的这个对象中，是为了在以后运行环境中调用当前对象的时候能够找到对象中的这些方法。
      _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');
      this.input = this.$("#new-todo");
      this.allCheckbox = this.$(".mark-all-done")[0];
      Todos.bind('add',     this.addOne);
      Todos.bind('reset',   this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
    },

    // 更改当前任务列表的状态
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       done,
        remaining:  remaining
      }));

      //根据剩余多少未完成确定标记全部完成的checkbox的显示
      this.allCheckbox.checked = !remaining;
    },

    //添加一个任务到页面id为todo-list的div/ul中
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // 把Todos中的所有数据渲染到页面,页面加载的时候用到
    addAll: function() {
      Todos.each(this.addOne);
    },

    //生成一个新Todo的所有属性的字典
    newAttributes: function() {
      return {
        content: this.input.val(),
        order:   Todos.nextOrder(),
        done:    false
      };
    },

    //创建一个任务的方法，使用backbone.collection的create方法。将数据保存到localStorage,这是一个html5的js库。需要浏览器支持html5才能用。
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());  //创建一个对象之后会在backbone中动态调用Todos的add方法，该方法已绑定addOne。
      this.input.val('');
    },

    // 去掉所有已经完成的任务
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    },

    //用户输入新任务的时候提示，延时1秒钟
    //处理逻辑是：首先获取隐藏的提示节点的引用，然后获取用户输入的值，
    //先判断是否有设置显示的延时，如果有则删除，然后再次设置，因为这个事件是按键的keyup时发生的，所以该方法会被连续调用。
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    },

    //处理页面点击标记全部完成按钮
    //处理逻辑：如果标记全部按钮已选，则所有都完成，如果未选，则所有的都未完成。
    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }
  });
```
通过上面的代码，以及其中的注释，我们应该认识了其中的各个函数的作用。但是有一点没有说到的是template这个东西。

在前几篇的view介绍中我们已经认识过了简单的模板使用，以及变量参数的传递：

```
<script type="text/template" id="search_template">
        <label><%= search_label %></label>
        <input type="text" id="search_input" />
        <input type="button" id="search_button" value="Search" />
</script>

```
既然能定义变量，那么就能使用语法，如同django模板，那来看下带有语法的模板，也是上面的两个view用到的模板，我想这个是很好理解的。

```
<script type="text/template" id="item-template">
     <div class="todo <%= done ? 'done' : '' %>">
           <div class="display">
                 <input class="check" type="checkbox" <%= done ? 'checked="checked"' : '' %> />
                 <label class="todo-content"><%= content %></label>
                 <span class="todo-destroy"></span>
           </div>
           <div class="edit">
                <input class="todo-input" type="text" value="<%= content %>" />
           </div>
     </div>
</script>

<script type="text/template" id="stats-template">
     <% if (total) { %>
       <span class="todo-count">
             <span class="number"><%= remaining %></span>
             <span class="word"><%= remaining == 1 ? 'item' : 'items' %></span> left.
       </span>
     <% } %>

     <% if (done) { %>
       <span class="todo-clear">
             <a href="#">
               Clear <span class="number-done"><%= done %></span>
               completed <span class="word-done"><%= done == 1 ? 'item' : 'items' %></span>
             </a>
       </span>
     <% } %>
</script>
```

简单的语法，上面的那个对应TodoView。

这一篇文章就先到此为止，文章中我们了解到在todos这个实例中，view的使用，以及具体的TodoView和AppView中各个函数的作用，这意味着所有的肉和菜都已经放到你碗里了，下面就是如何吃下去的问题了。


**三、TODOs总结 **

我们已经对这个todos的功能、数据模型以及各个模块的实现细节进行了分析，这篇文章我们要对前面的分析进行一个整合。前面我们说过，有了肉和菜，剩下的就是要怎么吃。我个人倾向于菜和肉一起吃，这样不会觉得腻

首先让我们来回顾一下我们分析的流程：先对页面功能进行了分析，然后又分析了数据模型，最后又对view的功能和代码进行了详解。你是不是觉得这个分析里面少了点什么？没错了，就知道经验丰富的你已经看出来了，这里面少了对于流程的分析。

所以从我的分析中可以看的出来，我是先对各个原材料进行分析，然后再整体的分析（当然前提是我是理解流程的），这并不是分析代码的唯一方法，有时我也会采用跟着流程分析代码的方法。当然还有很多其他的分析方法，大家都是自己的套路嘛。

下面简单的说说流程分析的方法。记得多年前在学vb的时候，分析一个完整项目代码的时候，习惯从程序的入口点开始分析。虽然web网站和桌面软件的实现不同，但是大致思路是一样的（同时也有网站即软件的说法，在RESTful架构中）。所以我们要先找到网站的入口点所在。

和桌面应用项目的分析一样，网站的入口点就在于网页加载的时候。对于todos，自然就是加载所有的任务。所以对应着我们就可以发现这段代码

首先是对AppView的一个实例化：

``` var App = new AppView; ```

实例化，自然就会调用构造函数：

```
//在初始化过程中，绑定事件到Todos上，当任务列表改变时会触发对应的事件。最后把存在localStorage中的数据取出来。
initialize: function() {
      //下面这个是underscore库中的方法，用来绑定方法到目前的这个对象中，是为了在以后运行环境中调用当前对象的时候能够找到对象中的这些方法。
      _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');
      this.input = this.$("#new-todo");
      this.allCheckbox = this.$(".mark-all-done")[0];
      Todos.bind('add',     this.addOne);
      Todos.bind('reset',   this.addAll);
      Todos.bind('all',     this.render);

      Todos.fetch();
},

```

注意其中的Todos.fetch()方法，前面说过，这个项目是在客户端保存数据，所以使用fetch方法并不会发送请求到服务器。

另外在前面关于collection的单独讲解中我们也知道了collection中调用fetch方法之后就会触发reset这个方法。所以现在流程走向reset——>addAll这个方法。

来看addAll这个方法：

```
//添加一个任务到页面id为todo-list的div/ul中
addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
},

// 把Todos中的所有数据渲染到页面,页面加载的时候用到
addAll: function() {
     Todos.each(this.addOne);
},
```
在addAll中调用addOne方法，关于Todos.each很好理解，就是语法糖（简化的for循环），到此，加载页面的整个流程也就完成了。关于addOne方法的细节下面介绍。

然后再来看添加任务的流程，一个良好的代码命名风格始终是让人满心欢喜的。因为很显然，添加一个任务，自然就是addOne,其实你看events中的绑定也能知道，先看一下绑定：
```
// 绑定dom节点上的事件
events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted",
      "click .mark-all-done": "toggleAllComplete"
},
```

这里并没有addOne方法的绑定，但是却有createOnEnter，语意其实一样的，另外这里其实要说下关于showTooltip这个方法，在任务输入框中，按键弹起的时候执行这个方法，具体代码有详细的注释了，这里不多介绍。

来看主线，createOnEnter这个方法：
```

//创建一个任务的方法，使用backbone.collection的create方法。将数据保存到localStorage,这是一个html5的js库。需要浏览器支持html5才能用。
createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      //创建一个对象之后会在backbone中动态调用Todos的add方法，该方法已绑定addOne。
      this.input.val('');
},
```

注释已写明，Todos.create会调用addOne这个方法。由此顺理成章的来到addOne里面：

```
//添加一个任务到页面id为todo-list的div/ul中
addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
},
```
在里面实例化了一个TodoView类，前面我们说过，这个类是主管各个任务的显示的。具体代码就不细说了。

有了添加再来看更新，关于单个任务的操作，我们直接找TodoView就ok了。所以直接找到
```
// The DOM events specific to an item.
events: {
      "click .check"              : "toggleDone",
      "dblclick label.todo-content" : "edit",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter",
      "blur .todo-input"          : "close"
},
```

其中的edit事件的绑定就是更新的一个开头，而updateOnEnter就是更新的具体动作。所以只要搞清楚这俩方法的作用一切就明了了。这里同样不用细说。

在往后还有删除一条记录以及清楚已有记录的功能，根据上面的分析过程，我想大家都很容易的去‘顺藤模瓜’。

关于Todos的分析到此就算完成了，我注释过的整个代码在github上：https://github.com/the5fire/the5fire-todos ，供大家参考。

**backbone实例todos扩展+web服务器**

这里我们使用的是django+sqlite来进行实现。

现在我们应该对应着建立server端的model。不过在此之前，为了方便不熟悉django的童鞋，简单的写下开发过程：

1、创建工程

根据上一篇中介绍的django的环境安装和使用，创建一个工程:django-admin.py startproject todos，然后在cd到todos文件夹中：python manage.py startapp todo，创建一个应用（称作模块也行）。

2、配置文件

在todos根目录的settings中，主要是数据配置：

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'D:/mytodos', # Or path to database file if using sqlite3.
        'USER': '', # Not used with sqlite3.
        'PASSWORD': '', # Not used with sqlite3.
        'HOST': '', # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '', # Set to empty string for default. Not used with sqlite3.
    }
}
```
完整的配置最后贴出来供大家参考。有了上面的一个铺垫，开始创建model。打开todo文件夹中的models.py文件，写入以下代码：

```
from django.db import models

class Todo(models.Model):
    content = models.CharField(max_length=128)

    done = models.CharField(max_length=1,default='N') #Y表示完成N表示未完成
    order = models.IntegerField(blank=True)

```


然后再来创建views代码，关于django的mvc模式这里不介绍，大家跟着操作进行。在todo下新建一个views_todos.py文件。

这个views_todos文件是用来操作数据库的所有代码所在。关于数据库的操作，其实就是CRUD（create增加，request查询，update更新，delete删除），在django的基础上，很好写。

这里是全部代码：
```
#coding=utf-8

'''
    author:huyang
    date: 2012-3-26
    blog:http://the5fire.com
'''
from models import Todo
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson

'''
public
@desc 加载todo首页
@param
@return templates
'''
def index(request):
    return render_to_response('todo/todos.html',{})

'''
public
@desc 控制创建和读取方法的一个跳转
@param
@return
'''
def control_cr(request):
    if request.method == 'POST':
        return create(request)
    elif request.method == 'GET':
        return getAll(request)
    else:
        return HttpResponse('
access deny

')

'''
public
@desc 控制更新和删除方法的一个跳转
@param url中的todo对象id
@return
'''
def control_ud(request, todo_id):
    if request.method == 'PUT':
        return update(request,todo_id)
    elif request.method == 'DELETE':
        return delete(request,todo_id)
    else:
        return HttpResponse('
access deny

')
'''
protect
@desc 获取所有的todo对象，并转为json格式，返回
@param
@return json格式的todo列表
'''
def getAll(request):
    todos = Todo.objects.all()
    todo_dict = []
    flag_dict = {'Y':True,'N':False}
    for todo in todos:
        todo_dict.append({'id':todo.id,'content':todo.content,'done':flag_dict[todo.done],'order':todo.order})
    return HttpResponse(simplejson.dumps(todo_dict), mimetype = 'application/json')

'''
protect
@desc 创建一个todo记录
@param POST中的json格式todo对象
@return json格式{'success':True/False}
'''
def create(request):
    req = simplejson.loads(request.raw_post_data)
    content = req['content']
    order = req['order']

    if not content:
        return HttpResponse(simplejson.dumps({'success':False}), mimetype = 'application/json')
    todo = Todo()
    todo.content = content
    todo.order = order
    todo.save()
    return HttpResponse(simplejson.dumps({'success':True}), mimetype = 'application/json')

'''
protect
@desc 更新一条todo记录
@param POST中的json格式todo对象
@return json格式{'success':True/False}
'''
def update(request, todo_id):
    req = simplejson.loads(request.raw_post_data)
    content = req['content']
    done = req['done']
    order = req['order']
    flag_dict = {True:'Y',False:'N'}
    todo = Todo.objects.get(id = todo_id)
    todo.content = content
    todo.done = flag_dict[done]
    todo.order = order
    todo.save()
    return HttpResponse(simplejson.dumps({'success':True}), mimetype = 'application/json')

'''
protect
@desc 删除一条todo记录
@param url中的todo对象id
@return json格式{'success':True/False}
'''
def delete(request, todo_id):
    Todo.objects.get(id = todo_id).delete()
    return HttpResponse(simplejson.dumps({'success':True}), mimetype = 'application/json')
```
上面的代码中除了有CRUD代码之后，还有两个重要的函数：control_cr和control_ud，从名字很容易看出来，前者是控制创建和查询的，后者是控制更新和删除的。为什么这么写呢，其原因在于使用backbone在web端进行CRUD操作的时候，对应的url并不一样，因此我写了两个函数。

在control_cr中，根据GET和POST来判断是查询还是创建爱你，在control_ud中，根据PUST和DELETE来判断是更新还是删除。

上面代码中其他函数就不详解了，都是很简单的语句。

然后我们需要做的就是配置url，在todos下面的那个urls.py文件中的配置如下：
```
from django.conf.urls.defaults import patterns, include, url
import settings

from todo import views_todos

urlpatterns = patterns('',

    (r'^site_media/(?P.*)$', 'django.views.static.serve',{'document_root': settings.STATIC_DOC_ROOT,'show_indexes': False}),

    (r'^todo/control/$', views_todos.control_cr),
    (r'^todo/control/(\d*)$', views_todos.control_ud),  #例如：http://127.0.0.1:8000/todo/control/1/ PUT就是更新，DELETE就是删除
    (r'^', views_todos.index),
)
```
当然web端我们直接使用前面分析过的todos的，只需要修改一下其中的代码。

1、在Todo的模型中加入： urlRoot: '/todo/control/'

2、在collection TodoList中加入：url: '/todo/control/'，并且去掉：localStorage: new Store("todos-backbone"),

这样就ok了。在django项目中还需要配置site_media和templates文件，结构如下：

![struct](http://www.the5fire.com/wp-content/uploads/2012/04/struct.png)

我用的Komodo Edit这个IDE来开发的。你只要按照这样的结构来建立文件和文件夹就行了。

最后给出settings的所有代码：
```
# Django settings for testbackbone project.

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'D:/mytodos', # Or path to database file if using sqlite3.
        'USER': '', # Not used with sqlite3.
        'PASSWORD': '', # Not used with sqlite3.
        'HOST': '', # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '', # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = './site_media/'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/site_media/'


# URL prefix for admin static files -- CSS, JavaScript and images.
# Make sure to use a trailing slash.
# Examples: "http://foo.com/static/admin/", "/static/admin/".
ADMIN_MEDIA_PREFIX = '/static/admin/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
# 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'q4%c$1t0@x0iaco8!8eacy5-g8t)z1549$s4049xf^2y2#!0ef'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
# 'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'todos.urls'
import os
TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
     os.path.join(os.path.dirname(__file__), 'templates').replace('\\','/'),
)

INSTALLED_APPS = (
    #'django.contrib.auth',
    #'django.contrib.contenttypes',
    #'django.contrib.sessions',
    ##'django.contrib.sites',
    #'django.contrib.messages',
    #'django.contrib.staticfiles',
    'todos.todo',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)

STATIC_DOC_ROOT = './site_media'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
```

代码已经放到github上了，建议大家下载运行参考。https://github.com/the5fire/the5fire-servertodos






