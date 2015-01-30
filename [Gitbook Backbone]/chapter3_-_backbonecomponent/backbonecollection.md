# Backbone中的Collection实例

**collection是model对象的一个有序的集合**

概念理解起来十分简单，在通过几个例子来看一下，会觉得更简单。


1、关于book和bookshelf的例子

```
Book = Backbone.Model.extend({

    defaults : {

        title:'default'

    },

    initialize: function(){

        //alert('Hey, you create me!');

    }

});

BookShelf = Backbone.Collection.extend({

    model : Book

});

var book1 = new Book({title : 'book1'});
var book2 = new Book({title : 'book2'});
var book3 = new Book({title : 'book3'});

//注意这里面是数组,或者使用add
//var bookShelf = new BookShelf([book1, book2, book3]);
var bookShelf = new BookShelf;

bookShelf.add(book1);
bookShelf.add(book2);
bookShelf.add(book3);
bookShelf.remove(book3);

//基于underscore这个js库，还可以使用each的方法获取collection中的数据
bookShelf.each(function(book){

    alert(book.get('title'));

});

```


很简单，不解释


**2、使用fetch从服务器端获取数据**

首先要在上面的的Bookshelf中定义url，注意collection中并没有urlRoot这个属性。或者你直接在fetch方法中定义url的值，如下：


```
bookShelf.fetch({url:'/getbooks/',success:function(collection,response){
        collection.each(function(book){
            alert(book.get('title'));
        });

    },error:function(){

        alert('error');

    }
});

```
其中也定义了两个接受返回值的方法，具体含义我想很容易理解:

返回正确格式的数据，就会调用success方法，错误格式的数据就会调用error方法，当然error方法也看添加和success方法一样的形参。

对应的BookShelf的返回格式如下：[{'title':'book1'},{'title':'book2'}.....]


**3、reset方法**

这个方法的时候是要和上面的fetch进行配合的，collection在fetch到数据之后，会调用reset方法，所以你需要在collection中定义reset方法或者是绑定reset方法。这里使用绑定演示：

```
bookShelf.bind('reset',showAllBooks);
showAllBooks = function(){
    bookShelf.each(function(book){
        //将book数据渲染到页面。
    });
}

```
> **注意：**绑定的步骤要在fetch之前进行。


**完整代码**

```
<!DOCTYPE html>
<html>
<head>
    <title>the5fire-backbone-collection</title>
</head>
<body>
</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
<script src="http://ajax.cdnjs.com/ajax/libs/underscore.js/1.1.4/underscore-min.js"></script>
<script src="http://ajax.cdnjs.com/ajax/libs/backbone.js/0.3.3/backbone-min.js"></script>
<script>
(function ($) {
    //collection是一个简单的models的有序集合
    //1、一个简单的例子

    Book = Backbone.Model.extend({
        defaults : {    // 感谢网友蓝色动力指正改为defaults
            title:'default'
        },
        initialize: function(){
            //alert('Hey, you create me!');
        }
    });
    BookShelf = Backbone.Collection.extend({
        model : Book
    });

    var book1 = new Book({title : 'book1'});
    var book2 = new Book({title : 'book2'});
    var book3 = new Book({title : 'book3'});

    //var bookShelf = new BookShelf([book1, book2, book3]); //注意这里面是数组,或者使用add
    var bookShelf = new BookShelf;
    bookShelf.add(book1);
    bookShelf.add(book2);
    bookShelf.add(book3);
    bookShelf.remove(book3);
    /*
    for(var i=0; i<bookShelf.models.length; i++) {
        alert(bookShelf.models[i].get('title'));
    }
    */
    //基于underscore这个js库，还可以使用each的方法获取collection中的数据
    bookShelf.each(function(book){
        alert(book.get('title'));
    });

    //2、使用fetch从服务器端获取数据,使用reset渲染
    bookShelf.bind('reset', showAllBooks);
    bookShelf.fetch({url:'/getbooks/',success:function(collection,response){
        collection.each(function(book){
            alert(book.get('title'));
        });
    },error:function(){
        alert('error');
    }});
    showAllBooks = function(){
        bookShelf.each(function(book){
            //将book数据渲染到页面。
        });
    }
    //上述代码仅仅均为可正常执行的代码，不过关于服务器端的实例在后面会有。
})(jQuery);
</script>
</html>

```
































