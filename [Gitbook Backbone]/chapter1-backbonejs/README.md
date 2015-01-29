# 初识backbone.js
### backbone，英文意思是：勇气， 脊骨。


但是在程序里面，尤其是在backbone后面加上后缀js之后，它就变成了一个框架，一个js库。

backbone.js，不知道作者是以什么样的目的来对其命名的，可能是希望这个库会成为web端开发中脊梁骨。

backbone.js提供了一套web开发的框架，通过Models进行key-value绑定及custom事件处理,通过Collections提供一套丰富的API用于枚举功能,通过Views来进行事件处理及与现有的Application通过RESTful JSON接口进行交互.

**它是基于jquery和underscore的一个js框架。**

整体上来说，backbone.js是一个web端javascript的mvc框架，算得上是**重量级**的框架。它能让你像写java代码一些写js代码，定义类，类的属性以及方法。更重要的是它能够优雅的把原本无逻辑的javascript代码进行组织，并且提供数据和逻辑相互分离的方法，减少代码开发过程中的数据和逻辑混乱。

通过backbone，你可以把你的数据当作Models，通过Models你可以创建数据，进行数据验证，销毁或者保存到服务器上。当界面上的操作引起model中属性的变化时，model会触发change的事件;那些用来显示model状态的views会接受到model触发change的消息，进而发出对应的响应，并且重新渲染新的数据到界面。在一个完整的backbone应用中，你不需要写那些胶水代码来从DOM中通过特殊的id来获取节点，或者手工的更新HTML页面，因为在model发生变化时，views会很简单的进行自我更新。

上面是一个简单的介绍，关于backbone我看完他的介绍和简单的教程之后，第一印象是它为前端开发制定了一套自己的规则，在这个规则下，我们可以像使用django组织python代码一样的组织js代码，它很优雅，能够使前端和server的交互变得简单。

**关于backbone的更多介绍参看这个：**

http://documentcloud.github.com/backbone/

http://backbonetutorials.com/

### backbone的应用范围：

它既然是一个重量级的框架，那就不是随便什么地方都能用的，不然就会出现杀鸡用牛刀，费力不讨好的结果。那么适用在哪些地方呢？

根据我的理解，以及backbone的功能，如果单个网页上有非常复杂的业务逻辑，那么用它很合适，它可以很容易的操作dom和组织js代码。

豆瓣的阿尔法城是一个极好的例子。

当然，除了我自己分析的应用范围之外，在backbone的文档上看到了很多使用它的外国站点，有很多，说明backbone还是很易用的。
