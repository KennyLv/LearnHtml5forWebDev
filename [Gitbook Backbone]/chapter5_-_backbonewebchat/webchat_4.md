# Webchat (4) 后端开发


关于django开发应用，相比大家都已经熟悉了，不熟悉的可以移步到这里：django使用


webchat的整体目录结构还是同todos一样，有图有真相：

webchatsource

先来配置数据库连接：

```

DATABASES = {

    'default': {

        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.

        'NAME': 'webchatdb',                      # Or path to database file if using sqlite3.

        'USER': '',                      # Not used with sqlite3.

        'PASSWORD': '',                  # Not used with sqlite3.

        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.

        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.

    }

}

```

当然，像扩展todos时一样，settings.py文件中还是有很多东西需要配置的。建议有兴趣的参考我放到git上的代码，最后给出链接。

有一点要提醒的是，因为这次用到了session的操作，所以在INSTALL_APP配置如下：

```

INSTALLED_APPS = (

    'django.contrib.sessions',

    'webchat.chat',

)
```


然后再来配置urls.py，这个文件最先配置和最后配置都可以，其实我倒是觉得这个urls可以当作一个详细设计来用，定义好每一个后台需要提供函数，等后台来实现就行。不过很多时候并不是一开始就能很明确所需的功能的，就是想是我做这个webchat一样，尽管先前分析并扩展了todos。

来看urls.py的配置：

```
#encoding=utf-8
'''
    author:the5fire
    blog:http://www.the5fire.com
    date:2012-4-6
'''
from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
import settings
from webchat.chat import views_chat

urlpatterns = patterns('',
     (r'^site_media/(?P.*)$', 'django.views.static.serve',{'document_root': settings.STATIC_DOC_ROOT,'show_indexes': False}),
     (r'^chat/$', views_chat.chat),
     (r'^chat/(\w+)$', views_chat.chatDelete),
     (r'^$', views_chat.loadpage),
)
)

```
两个主要的url：chat以及chat/（\w+）,前者是让CR来访问的，后者是一个正则的url，表示为chat/[大于1位的任意字符]，用来让UD访问，因为这俩都是需要传id的。


urls.py就是一个实现的指导，那么有了指导，来看对应实现吧，views_chat.py：

```

#coding=utf-8
'''
    author:the5fire
    blog:http://www.the5fire.com
    date:2012-4-09
'''
from models import Chat
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.utils import simplejson
import time

'''
public
@desc 页面载入或者刷新的时候，重置记录指针为0
@return
'''

def loadpage(request):

    request.session['record_offset'] = 0
    return render_to_response('chat/chat.html',{})


'''

public

@desc 简单的控制添加和查询

'''

def chat(request):
    if request.method == 'POST':
        return say(request)
    elif request.method == 'GET':
        return chatAllLog(request
    else:
        return HttpResponse('access deny')

'''

public

@desc 删除对应的记录

'''

def chatDelete(request,delete_id):
    Chat.objects.get(id=delete_id).delete()
    record_offset = request.session.get('record_offset')
    request.session['record_offset'] = record_offset - 1
    return HttpResponse(simplejson.dumps({'success':True}), mimetype = 'application/json')

'''
public
@desc 保存用户的消息到数据库中
@param POST中的，username和content
'''

def say(request):
    req = simplejson.loads(request.raw_post_data)
    username = req['username']
    content = req['content']

    if not content:
        return HttpResponse(simplejson.dumps({'success':False}), mimetype = 'application/json')

    chat = Chat()
    chat.content = content
    chat.username = username
    chat.save()

    return HttpResponse(simplejson.dumps({'success':True}), mimetype = 'application/json')

'''
public
@desc 根据session中的record_offset的数值获取以该数值为起始的所有记录
@return 返回对应的对象的字典形式
'''

def chatAllLog(request):
    if 'record_offset' in request.session:
        record_offset = request.session.get('record_offset')
    else:
        record_offset = 0
        request.session['record_offset'] = 0
    chatList = Chat.objects.all()[record_offset:]
    chatlist_dict = []
    request.session['record_offset'] = len(chatList) + record_offset
    for chat in chatList:
        chatlist_dict.append({'id':chat.id,'content':chat.content,
                              'username':chat.username,
                              'date':str(chat.date).split('.')[0]
                              })
    return HttpResponse(simplejson.dumps(chatlist_dict), mimetype = 'application/json')

```
里面的代码确实不多，只有五个函数，第一个loadpage自然就不用说了。那么剩下的四个呢？

chat函数，作用很明确嘛，就像在urls.py上说的一样，只负责根据POST和GET来执行对应操作。

而say和chatAllLog就是增加和查询的函数。另外一个chatDelete很明显就是删除的操作。


在实现server端的时候其实是有一个疑问的。就是在查询的时候怎么返回已有的聊天记录，因为只有简单的一张表。

一开始的构思是web端每隔两三秒就fetch一下，把所有的数据都拿过去。但是这对于服务器和带宽来说开销太大，每次都查询和传递所有的数据确实显的太笨了。



那么怎么才能每次只返回最新插入数据库中的数据呢？

本来我想从backbone的collection.fetch这个函数上下手的，但是没找到我想象的那种“差异化查询“的东西。所以就想了一个比较笨的方法，就是使用session来记录每次取了多少数据，因为数据是累加的，所以只需要从对应的记录开始取就可以了。


所以就出现上面代码中没有提到的session操作。

具体来说有三个操作：


第一、每提取一次数据，都进行统计，统计出一共取了多少条数据到web端。


第二、每次删除一条记录，对应的减少session中数据的统计。


第三，每次刷新页面都要从0开始计数。




所以这样就出现了上述代码中关于session的操作部分。


好像遗忘了实体类的介绍，不过我觉得这个不重要，因为它和web端的是一样的。为了完整，粘贴到下面：

```
#coding=utf-8
from django.db import models

class Chat(models.Model):
    content = models.CharField(max_length=1024)
    username = models.CharField(max_length=1024)
    date = models.DateTimeField(auto_now_add=True)

```

到此为止，这个webchat已经构建完毕了，目前这个项目看起来还是很简单的，如果你感兴趣可以对其进行完善。关于backbone的实践到此也告一段落了。


想要告诉大家的是，一定要动手去做一个项目，即便是你跟着文章做了一遍。在我分析todos和写webchat时是两种截然不同的感受，分析todos时我觉得作者的代码很凝练，很优雅，我看着能理解，感觉能写出来，但是在写webchat的时候才发现，明白、理解不一定意味着你能写出来，所以想掌握、提高还是要多实践。
