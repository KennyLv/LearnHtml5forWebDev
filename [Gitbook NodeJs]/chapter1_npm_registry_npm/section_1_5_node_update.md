# Node 升级

### ONE

从官网下载Node.js源码版：
* http://nodejs.org/dist/v0.10.8/node-v0.10.8.tar.gz

解压源码包:
* $ tar zvxf node-v0.10.8.tar.gz

安装：
* $ cd node-v0.10.8
* $ sudo ./configure
* $ sudo make
* $ sudo make install

验证安装：
* $ node -v
   ```v0.10.8```

-----------------------------------------------------

### TWO

今天，又发现一个超级简单的升级node.js的方法。一行命令搞定，省去了重新编译安装的过程。

node有一个模块叫n（这名字可够短的。。。），是专门用来管理node.js的版本的。

1. 首先安装n模块：```npm install -g n```

2. 升级node.js到最新稳定版 ```n stable ```
 * n后面也可以跟随版本号比如：
 * n v0.10.26 或 n 0.10.26

下面顺便再写几个npm的常用命令

|  命令                 | 简介                              |
|-----------------------|-----------------------------------|
|  npm -v               | #显示版本，检查npm是否正确安装。  |
|npm install express    | #安装express模块                  |
|npm install -g express | #全局安装express模块              |
|npm list               |  #列出已安装模块                  |
|npm show express       |  #显示模块详情                    |
|npm update             |  #升级当前目录下的项目的所有模块  |
|npm update express     |  #升级当前目录下的项目的指定模块  |
|npm update -g express  |  #升级全局安装的express模块       |
|npm uninstall express  |  #删除指定的模块                  |


