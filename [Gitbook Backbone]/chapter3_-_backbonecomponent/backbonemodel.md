# Backbone中的Model实例

关于backbone，最基础的一个东西就是model，这个东西就像是后端开发中的数据库映射那个model一样，也是数据对象的模型，并且应该是和后端的model有相同的属性（仅是需要通过前端来操作的属性）。
下面就从实例来一步一步的带大家来了解backbone的model到底是什么样的一个东西。
首先定义一个html的页面：

```
<!DOCTYPE html>
<html>
    <head>
        <title>the5fire-backbone-model</title>
    </head>
    <body>
    </body>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
    <script src="http://ajax.cdnjs.com/ajax/libs/underscore.js/1.1.4/underscore-min.js"></script>
    <script src="http://ajax.cdnjs.com/ajax/libs/backbone.js/0.3.3/backbone-min.js"></script>
    <script>
        (function ($) {
        /**
          *此处填充代码
          **/
        })(jQuery);
    </script>
</html>

```

下面的代码需要填到这个html的script标签中的function中。

**1、最简单的一个对象**

```

Man = Backbone.Model.extend({
        initialize: function(){
            alert('Hey, you create me!');
        }
    });
var man = new Man;

```
这个就很简单了，在helloworld里面也有了一个model的展现，不定义了属性，这里是一个 初始化时的方法，或者称之为构造函数。

**2、对象赋值的两种方法**

第一种，直接定义，设置默认值。

```
Man = Backbone.Model.extend({
    initialize: function(){
        alert('Hey, you create me!');
    },
    defaults: {
        name:'张三',
        age: '38'
    }
});

var man = new Man;
alert(man.get('name'));

```
第二种，赋值时定义

```
Man = Backbone.Model.extend({
    initialize: function(){
        alert('Hey, you create me!');
    }
});
man.set({name:'the5fire',age:'10'});
alert(man.get('name'));

```
取值的时候都是用get。

**3、对象中的方法**

```
Man = Backbone.Model.extend({
    initialize: function(){
        alert('Hey, you create me!');
    },
    defaults: {
        name:'张三',
        age: '38'
    },
    aboutMe: function(){
        return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
    }
});
var man = new Man;
alert(man.aboutMe());
```

**4、监听对象中属性的变化**


```
Man = Backbone.Model.extend({
    initialize: function(){
        alert('Hey, you create me!');
        //初始化时绑定监听
        this.bind("change:name",function(){
            var name = this.get("name");
            alert("你改变了name属性为：" + name);
        });
    },
    defaults: {
        name:'张三',
        age: '38'
    },
    aboutMe: function(){
        return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
    }
});
var man = new Man;
man.set({name:'the5fire'})  //触发绑定的change事件，alert。

```
**5、为对象添加验证规则，以及错误提示**

```
Man = Backbone.Model.extend({
    initialize: function(){
        alert('Hey, you create me!');
        //初始化时绑定监听
        this.bind("change:name",function(){
            var name = this.get("name");
            alert("你改变了name属性为：" + name);
        });
        this.bind("error",function(model,error){
            alert(error);
        });
    },
    defaults: {
        name:'张三',
        age: '38'
    },
    validate:function(attributes){
        if(attributes.name == '') {
            return "name不能为空！";
        }
    },
    aboutMe: function(){
        return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
    }
});
var man = new Man;
man.set({name:''}); //根据验证规则，弹出错误提示。

```

**6、对象的获取和保存，需要服务器端支持才能测试。**

首先需要为对象定义一个url属性，调用save方法时会post对象的所有属性到server端。

```
Man = Backbone.Model.extend({
    url:'/save/',
    initialize: function(){
        alert('Hey, you create me!');
        //初始化时绑定监听
        this.bind("change:name",function(){
            var name = this.get("name");
            alert("你改变了name属性为：" + name);
        });
        this.bind("error",function(model,error){
            alert(error);
        });
    },
    defaults: {
        name:'张三',
        age: '38'
    },
    validate:function(attributes){
        if(attributes.name == '') {
            return "name不能为空！";
        }
    },
    aboutMe: function(){
        return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
    }
});
var man = new Man;;
man.set({name:'the5fire'});
man.save();  //会发送POST到模型对应的url，数据格式为json{"name":"the5fire","age":38}
//然后接着就是从服务器端获取数据使用方法fetch([options])
var man1 = new Man;
//第一种情况，如果直接使用fetch方法，那么他会发送get请求到你model的url中，
    //你在服务器端可以通过判断是get还是post来进行对应的操作。
man1.fetch();
//第二种情况，在fetch中加入参数，如下：
man1.fetch({url:'/getmans/'});
    //这样，就会发送get请求到/getmans/这个url中，
    //服务器返回的结果样式应该是对应的json格式数据，同save时POST过去的格式。

//不过接受服务器端返回的数据方法是这样的：
man1.fetch({url:'/getmans/',success:function(model,response){
        alert('success');
        //model为获取到的数据
        alert(model.get('name'));
    },error:function(){
        //当返回格式不正确或者是非json数据时，会执行此方法
        alert('error');
    }});

```

注：上述代码仅仅均为可正常执行的代码，不过关于服务器端的实例在后面会有。

这里还要补充一点，就是关于服务器的异步操作都是通过Backbone.sync这个方法来完成的，调用这个方法的时候会自动的传递一个参数过去，根据参数向服务器端发送对应的请求。比如你save，backbone会判断你的这个对象是不是新的，如果是新创建的则参数为create，如果是已存在的对象只是进行了改变，那么参数就为update，如果你调用fetch方法，那参数就是read，如果是destory，那么参数就是delete。也就是所谓的CRUD ("create", "read", "update", or "delete")，而这四种参数对应的请求类型为POST，GET，PUT，DELETE。你可以在服务器根据这个request类型，来做出相应的CRUD操作。

> **Note:** 忘了解释关于url和urlRoot的事情了，如果你设置了url，那么你的CRUD都会发送对应请求到这个url上，但是这样又一个问题，就是delete请求，发送了请求，但是却没有发送任何数据，那么你在服务器端就不知道应该删除哪个对象（记录），所以这里又一个urlRoot的概念，你设置了urlRoot之后，你发送PUT和DELETE请求的时候，其请求的url地址就是：/baseurl/[model.id]，这样你就可以在服务器端通过对url后面值的提取更新或者删除对应的对象（记录）


关于这个Backbone.sync以后可能会说到，不过目前先以简单入门为主。

**数据验证部分更新到backbone.js1.0.0**


