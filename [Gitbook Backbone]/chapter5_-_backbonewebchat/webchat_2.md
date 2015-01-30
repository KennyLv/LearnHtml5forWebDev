# Webchat (2) 详细设计


由上一篇的功能，我们可以概括出需要的实体类，模型如下：
```
chat:
    id     #主键
    content   #消息
    username    #昵称
    date    #消息发送时间
```
这样的一个模型基本上已经满足了功能上的需求了。再由上一篇中的那个页面设计，我们也进行了实现，代码就不解释了。

先是html：

```
<!DOCTYPE html>
<html>
  <head>
    <title>the5fire-WebChat</title>
    <link href="/site_media/chat/css/chat.css" media="all" rel="stylesheet" type="text/css"/>
    <script src="/site_media/chat/js/jquery-1.7.1.js"></script>
    <script src="/site_media/chat/js/underscore-1.3.1.js"></script>
    <script src="/site_media/chat/js/backbone.js"></script>
    <script src="/site_media/chat/js/chat.js"></script>
  </head>
  <body>
    <div class="wrap">
      <div class="main">
        <div class="head">
          <span>欢迎光临the5fire聊天室，当前时间：<label id="nowdate"></label></span>
        </div>
        <div class="screen">
          <ul class="chat_list">
            <li><div class="msgtitle">the5fire 2012-04-10 23:16:00</div><p>大家好！</p></li>
            <li><div class="msgtitle">other 2012-04-10 23:16:00</div><p>你好</p></li>
          </ul>
        </div>
        <div class="send_message">
          <div class="message">
            <textarea id="content" rows="4"></textarea>
          </div>
          <div class="opt">
            <label for="nickname">昵称：</label><input name="nickname" id="nickname"/><br/>
            <button id="send">发送消息</button>
          </div>
        </div>
      </div>
    </div>
  </body>
  <script>
    function  show_time()
    {
        var today,hour,second,minute,year,month,date,time;

        today=new Date();

        year = today.getFullYear();
        month = today.getMonth()+1;
        date = today.getDate();
        hour = today.getHours();
        minute =today.getMinutes();
        second = today.getSeconds();
        if(minute < 10) minute = '0' + minute;
        if(second < 10) second = '0' + second;
        time = year + "-" + month + "-" + date +" " + hour + ":" + minute + ":" + second;
        $("#nowdate").html(time);
    }
    setInterval(show_time,1000);
  </script>
</html>
```

然后在是CSS代码：

```
/*
        author:the5fire
        blog:http://www.the5fire.net
        date:2012-04-09
*/
html {
        margin:0;
        padding:0;
}
body {
        margin:0;
        font-size:14px;
}
.wrap {
        background-color: #B26F4C;
        width: 100%;
        height: 800px;
}


.main {
        width: 50%;
        margin: auto;
        height: 700px;
        background-color: #fff;
}

.head {
        height: 40px;
        padding-top: 10px;
        border-bottom: 1px solid #000;
        font-size:20px;
}

.head span{
        margin: auto;
        width: auto;
}

.screen {
        height:400px;
        width:auto;
        overflow-y: scroll;
        background:#CCCCCC;
        border: 2px solid #000;
}

.screen .msgtitle {
        color:blue;
}

.send_message {
        margin-top: 5px;
}

.send_message .message {
        width:60%;
        float:left;
}

.send_message .message textarea {
        width:100%;
}

.send_message .opt {
        margin-right:10px;
        margin-top:10px;
        float:right;
}
```
来看下界面：

界面设计和模型都有了，那么后台应该有哪些接口呢？从功能上看也是很简单，只有两个：

1. 说话（say），在此方法中，讲用户输入的内容保存到数据库。
2. 获取所有聊天记录（getChatLog）,将数据库的内容全部提取出来。




