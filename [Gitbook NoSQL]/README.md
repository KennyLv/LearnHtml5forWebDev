# About NoSQL

### MongoDB

[MongoDB](http://www.mongodb.org/) (from "humongous") is an open-source document database, and the leading NoSQL database. Written in C++, MongoDB features:

> MongoDB部署实验系列文章http://blog.fens.me/series-mongodb/


### Redis

[Redis](http://redis.io/)是REmote DIctionary Server的缩写。

* 在Redis在官方网站的的副标题是A persistent key-value database with built-in net interface written in ANSI-C for Posix systems，这个定义偏向key value store。

* 还有一些看法则认为Redis是一个memory database，因为它的高性能都是基于内存操作的基础。

* 另外一些人则认为Redis是一个data structure server，因为Redis支持复杂的数据特性，比如List, Set等。

对Redis的作用的不同解读决定了你对Redis的使用方式。这个问题的结果影响了我们怎么用Redis。

1. 如果你认为Redis是一个key value store, 那可能会用它来代替MySQL；
2. 如果认为它是一个可以持久化的cache, 可能只是它保存一些频繁访问的临时数据。

互联网数据目前基本使用两种方式来存储，关系数据库或者key value。但是这些互联网业务本身并不属于这两种数据类型，比如用户在社会化平台中的关系，它是一个list，如果要用关系数据库存储就需要转换成一种多行记录的形式，这种形式存在很多冗余数据，每一行需要存储一些重复信息。如果用key value存储则修改和删除比较麻烦，需要将全部数据读出再写入。

Redis在内存中设计了各种数据类型，让业务能够高速原子的访问这些数据结构，并且不需要关心持久存储的问题，从架构上解决了前面两种存储需要走一些弯路的问题。
