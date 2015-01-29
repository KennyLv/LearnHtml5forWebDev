# Chapter1 Bootsrap入门

接触bootstrap时间也不算短了，也用这个库做了几个内部系统了，使用的感觉真是很爽。

上面一句话很简单的介绍了下这个库，不知道会不会给你留下良好的第一印象。这个库是由twitter开发的一套开源库，主要功能就是提供了或者说定义了一系列css和js的接口（标准），只要你调用对应的接口（在html上其实是你定义对应的标签和对应的class）就能得到人家定义好的内容。**当然这里面还有less（这个后篇文章再说）。**这些接口能够让你很容易的开发出一套相对美观网站界面，以及常用的交互。

这个bootstrap库其实就是twitter程序员根据自己日常开发中的需要总结出来的一套库，然后开源给大家。就像是html5一样，不过是对众多开发这的日常习惯进行了一个规范的定义。
无论是bootstrap还是html5都为程序员的开发提供了便利。

使用bootstrap，我再也不用为了界面应该如何设计，css样式的定义发愁。
使用html5我可不再上网查一个html文件的头部应该怎么定义，只需要写<!DOCTYPE html>就ok。

当然提供的便利不知这些。
文字的描述还是干巴巴的，还是上些代码好些。

先来展示下我花了5分钟编写的界面（如果不是和别人一边说话一边写时间可能更短）：

![View](http://www.the5fire.net/wp-content/uploads/2012/06/the5firebootstrap-300x168.png)

然后看下代码：

```
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Bootstrap Demo</title>
        <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet">
        <link href="http://twitter.github.com/bootstrap/assets/css/docs.css" rel="stylesheet">
    </head>
    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="brand" target="_blank" href="http://www.the5fire.net">the5fire</a>
                    <div class="nav-collapse collapse">
                        <ul class="nav">
                            <li class="">
                            <a href="http://www.the5fire.net/about" target="_blank">关于the5fire</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <header class="jumbotron subhead" id="overview">
            <h1>欢迎来到the5fire的博客</h1>
            <p class="lead">使用Bootstrap构建</p>
            <div class="subnav">
                <ul class="nav nav-pills">
                    <li><a href="#">python</a></li>
                    <li><a href="#">django</a></li>
                    <li><a href="#">java</a></li>
                    <li><a href="#">读书</a></li>
                    <li><a href="#">设计模式</a></li>
                    <li><a href="#">软件开发</a></li>
                </ul>
            </div>
            </header>

            <section id="typography">
            <div class="page-header">
                <h1>python <small>记录python的学习历程</small></h1>
            </div>

            <!-- Headings & Paragraph Copy -->
            <div class="row">
                <div class="span4">
                    <h3>python学习笔记</h3>
                    <ul>
                        <li>python学习笔记1</li>
                        <li>python学习笔记2</li>
                        <li>python学习笔记3</li>
                    </ul>
                </div>
                <div class="span4">
                    <h3>python实战训练</h3>
                    <ul>
                        <li>python爬虫实战1</li>
                        <li>python爬虫实战2</li>
                        <li>python文件管理1</li>
                    </ul>
                </div>
                <div class="span4">
                    <h3>python心得总结</h3>
                    <ul>
                        <li>python总结1</li>
                        <li>python总结2</li>
                        <li>python总结3</li>
                    </ul>
                </div>
            </div>
            </section>
        </div>

        <div class="container">
            <footer class="footer">
            <p class="pull-right"><a href="#">返回顶部</a></p>
            <p>网站地图</p>
            <p>版权声明： <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.</p>
            </footer>
        </div>
    </body>

```

一切都是如此简单，不用在去像设计师一样去考虑该如何画界面之类的东西，作为程序员压力顿减。只需要用bootstrap定义好的库就行。

bootstrap官网地址：http://twitter.github.com/bootstrap/
