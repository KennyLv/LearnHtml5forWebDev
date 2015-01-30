
# Backbone 数据验证 Data Validation

**数据验证部分更新到backbone.js1.0.0**

Backbone API上说在使用set方法时会先执行validate（自定义）方法，但是我看Backbone源代码上下面这一段似乎有些问题，

```
_validate: function(attrs, options) {
    if (!options.validate || !this.validate) return true;
    attrs = _.extend({}, this.attributes, attrs);
    var error = this.validationError = this.validate(attrs, options) || null;
    if (!error) return true;
    this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
    return false;
}
```
它的第二行是判断options.validate和自定义的validate是否存在，当它们都存在时执行后面的语句，但是按照我们平常的写法：set({..})，options不存在，那么!options.validate一定是为true的，这样的话这个方法其实执行到第二行就执行完了，我们自定义的验证方法根本不执行。

当我把if (!options.validate || !this.validate) 改成if (!options.validate && !this.validate) 后，方法可以继续执行，绑定error方法：

```
this.bind("error",function(model,error){
    alert("initialize error:"+error);
});
```

这里的error是个布尔值，并不是我在validate方法里面返回的值。这是否正常？

经常有网友问说为啥你的代码不能执行，如果你是完全copy我的代码，那基本上不会出错，我的代码都是能正常运行之后才会放上来的。

至于很多人不能运行的原因我猜测只是大家只是把我的js部分代码拿走，没有看完整的上下文，我之前的代码没有注意版本问题，很多都是基于backbone0.3.x写的。

如果你用了最新的版本那可能有些部分会出错，毕竟backbone也会不断的改进修复之前的一些问题。

比如说那篇文章 backbone中的model实例 上面第5部分的数据验证,backbone在set中并没有默认的触发验证，而在之前应该是默认的（我只看了最新版的backbone源码），在save时会触发验证。

推荐大家在遇到问题的时候可以直接看源码，backbone的代码是比较好读懂的。
说回正题，要解决那个set时验证的问题只需要在set时加一个参数 set({name:''},{'validate':true} 就行了，代码如下：

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>the5fire-backbone-model</title>
    </head>
<body>

</body>
<script src="http://backbonejs.org/test/vendor/jquery.js"></script>
<script src="http://backbonejs.org/test/vendor/underscore.js"></script>
<script src="./backbone.js"></script>
<script>
    (function ($) {
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

        validate:function(attributes, options){
            if(attributes.name == '') {
                return "name不能为空！";
            }
        },
        aboutMe: function(){
            return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
        }
    });

    var man = new Man;
    man.on('invalid', function(model, error){
        alert(error);
    });
    man.set({name:''});
    //man.set({name:''}, {'validate':true});  //手动触发验证
    //man.save(); //save时触发验证。根据验证规则，弹出错误提示。

    })(jQuery);
    </script>
</html>
```
