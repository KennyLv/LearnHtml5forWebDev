### NPM远程服务器连接缓慢

使用NPM的国内镜像服务器，有三种方法：

**1）使用config命令**
```
npm config set registry http://registry.cnpmjs.org
npm info underscore （如果上面配置正确这个命令会有字符串response）
```

** 2）命令行指定 **
```
npm --registry http://registry.cnpmjs.org info underscore
```

** 3）编辑 ~/.npmrc 加入以下内容：**
```
registry = http://registry.cnpmjs.org
```
--------------------------





--------------------------
### NPM下载出错 "No compatible version found"

> 转载自 http://blog.fens.me/nodejs-npm-no-compatible-version

> 张丹(Conan), 程序员Java,R,PHP,Javascript

> weibo：@Conan_Z

> blog: http://blog.fens.me

#### 前言

NPM大家都熟，天天都在用。最近，NPM不断出现的下载出错 “npm ERR! Error: No compatible version found” ，已经影响到正常的开发工作，到了不得不解决的地步了。网上到处都是这个错误的问题，但解决问题的文章很难找到。我有必要来写一下。


我的系统环境
```
Win7 64bit
Node v0.10.5
NPM 1.2.19
```
NPM的下载出错

```
npm ERR! Error: No compatible version found: gulp-rename@'^1.2.0'
npm ERR! Valid install targets:
npm ERR! ["0.1.0","0.2.1","0.2.2","1.0.0","1.1.0","1.2.0"]
npm ERR!     at installTargetsError (D:\toolkit\nodejs\node_modules\npm\lib\cache.js:689:10)
npm ERR!     at D:\toolkit\nodejs\node_modules\npm\lib\cache.js:611:10
npm ERR!     at saved (D:\toolkit\nodejs\node_modules\npm\node_modules\npm-registry-client\lib\get.js:138:7)
npm ERR!     at Object.oncomplete (fs.js:107:15)
npm ERR! If you need help, you may report this log at:
npm ERR!
npm ERR! or email it to:
npm ERR!
```
像这种类库管理本来不用动脑子的事情，一下子就会变得很麻烦了，小白程序员肯定是各种抓狂，网上所有的文章都解决不了自己的问题，对Nodejs瞬间失去信心….

我的项目中，只是要配置gulp包及相关插件的依赖下载，项目配置文件为 package.json。
```

{
  "name": "nodejs-cnpm",
  "version": "0.0.1",
  "description": "cnpm",
  "keywords": [
    "cnpm"
  ],
  "author": "Conan Zhang ",
  "main": "cnpm",
  "dependencies": {},
  "devDependencies": {
    "gulp": "^3.8.7",
    "gulp-changed": "^1.0.0",
    "gulp-concat": "^2.3.4",
    "gulp-jshint": "^1.8.4",
    "gulp-minify-css": "^0.3.7",
    "gulp-ngmin": "^0.3.0",
    "gulp-rename": "^1.2.0",
    "gulp-uglify": "^1.0.0",
    "gulp-util": "^3.0.1"
  }
}

```

无论怎么运行都是No compatible version found的错误。

```

~ npm install
npm WARN package.json nodejs-cnpm@0.0.1 No readme data!
npm http GET https://registry.npmjs.org/gulp-changed
npm http GET https://registry.npmjs.org/gulp-concat
npm http GET https://registry.npmjs.org/gulp-ngmin
npm http GET https://registry.npmjs.org/gulp-uglify
npm http GET https://registry.npmjs.org/gulp-util
npm http GET https://registry.npmjs.org/gulp
npm http GET https://registry.npmjs.org/gulp-jshint
npm http GET https://registry.npmjs.org/gulp-minify-css
npm http GET https://registry.npmjs.org/gulp-rename
npm http 304 https://registry.npmjs.org/gulp-uglify
npm http 304 https://registry.npmjs.org/gulp-ngmin
npm ERR! Error: No compatible version found: gulp-uglify@'^1.0.0'
npm ERR! Valid install targets:
npm ERR! ["0.0.1","0.0.3","0.0.4","0.1.0","0.2.0","0.2.1","0.3.0","0.3.1","0.3.2","1.0.0-0","1.0.0"]
npm ERR!     at installTargetsError (D:\toolkit\nodejs\node_modules\npm\lib\cache.js:689:10)
npm ERR!     at D:\toolkit\nodejs\node_modules\npm\lib\cache.js:611:10
npm ERR!     at saved (D:\toolkit\nodejs\node_modules\npm\node_modules\npm-registry-client\lib\get.js:138:7)
npm ERR!     at Object.oncomplete (fs.js:107:15)
npm ERR! If you need help, you may report this log at:
npm ERR!
npm ERR! or email it to:
npm ERR!

npm ERR! System Windows_NT 6.1.7601
npm ERR! command "D:\\toolkit\\nodejs\\\\node.exe" "D:\\toolkit\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "install"
npm ERR! cwd D:\workspace\javascript\nodejs-cnpm
npm ERR! node -v v0.10.5
npm ERR! npm -v 1.2.19
npm http 304 https://registry.npmjs.org/gulp-concat
npm http 304 https://registry.npmjs.org/gulp-jshint
npm http 304 https://registry.npmjs.org/gulp-minify-css
npm http 304 https://registry.npmjs.org/gulp-changed
npm http 304 https://registry.npmjs.org/gulp-util
npm http 304 https://registry.npmjs.org/gulp
npm http 304 https://registry.npmjs.org/gulp-rename
npm ERR!
npm ERR! Additional logging details can be found in:
npm ERR!     D:\workspace\javascript\nodejs-cnpm\npm-debug.log
npm ERR! not ok code 0
```

####  官方解决方案

查看NPM官方的说明Issue列表( https://github.com/npm/npm/issues/4984 )，这个问题已经被解决，但解决办法确实很不友好。

* 如果在Linux系统中，通过一条命令更新npm可以解决。```npm install -g npm```

* 在Window环境中，必须升级NPM到1.4.10以上的版本，我重新安装了node-v0.10.31-x64.msi，对应的NPM为1.4.23，再此运行```npm install```命令，依赖包下载运行正常。

升级后的系统环境
```
Win7 64bit
Node 0.10.31
NPM 1.4.23
```
下载依赖包，运行正常。

```
~ npm install
npm WARN package.json nodejs-cnpm@0.0.1 No repository field.
npm WARN package.json nodejs-cnpm@0.0.1 No README data
npm WARN deprecated gulp-ngmin@0.3.0: Deprecated in favor of gulp-ng-annotate: https://github.com/Kagami/gulp-ng-annotat
e - Reasoning: https://github.com/btford/ngmin/issues/93
gulp-rename@1.2.0 node_modules\gulp-rename

gulp-changed@1.0.0 node_modules\gulp-changed
└── through2@0.6.1 (xtend@4.0.0, readable-stream@1.0.31)

gulp-util@3.0.1 node_modules\gulp-util
├── lodash._reinterpolate@2.4.1
├── dateformat@1.0.8-1.2.3
├── minimist@1.1.0
├── lodash@2.4.1
├── chalk@0.5.1 (escape-string-regexp@1.0.1, ansi-styles@1.1.0, supports-color@0.2.0, strip-ansi@0.3.0, has-ansi@0.1.0)
├── through2@0.6.1 (xtend@4.0.0, readable-stream@1.0.31)
├── multipipe@0.1.1 (duplexer2@0.0.2)
├── vinyl@0.4.2 (clone-stats@0.0.1)
└── lodash.template@2.4.1 (lodash.values@2.4.1, lodash.defaults@2.4.1, lodash._escapestringchar@2.4.1, lodash.templatesettings@2.4.1, lodash.keys@2.4.1, lodash.escape@2.4.1)

gulp-uglify@1.0.0 node_modules\gulp-uglify
├── deepmerge@0.2.7
├── vinyl-sourcemaps-apply@0.1.1 (source-map@0.1.38)
├── through2@0.6.1 (xtend@4.0.0, readable-stream@1.0.31)
└── uglify-js@2.4.15 (uglify-to-browserify@1.0.2, async@0.2.10, optimist@0.3.7, source-map@0.1.34)

gulp-minify-css@0.3.7 node_modules\gulp-minify-css
├── memory-cache@0.0.5
├── bufferstreams@0.0.1
├── clean-css@2.2.15 (commander@2.2.0)
├── through2@0.5.1 (xtend@3.0.0, readable-stream@1.0.31)
└── gulp-util@2.2.20 (lodash._reinterpolate@2.4.1, dateformat@1.0.8-1.2.3, minimist@0.2.0, chalk@0.5.1, vinyl@0.2.3,lodash.template@2.4.1, multipipe@0.1.1)

gulp-concat@2.3.4 node_modules\gulp-concat
├── through@2.3.4
├── concat-with-sourcemaps@0.1.3 (source-map@0.1.38)
└── gulp-util@2.2.20 (dateformat@1.0.8-1.2.3, lodash._reinterpolate@2.4.1, minimist@0.2.0, chalk@0.5.1, multipipe@0.1.1, vinyl@0.2.3, lodash.template@2.4.1, through2@0.5.1)

gulp-ngmin@0.3.0 node_modules\gulp-ngmin
├── gulp-util@2.2.20 (lodash._reinterpolate@2.4.1, dateformat@1.0.8-1.2.3, minimist@0.2.0, chalk@0.5.1, vinyl@0.2.3,through2@0.5.1, lodash.template@2.4.1, multipipe@0.1.1)
├── through2@0.4.2 (xtend@2.1.2, readable-stream@1.0.31)
└── ngmin@0.5.0 (astral@0.1.0, clone@0.1.18, ngmin-dynamic@0.0.1, astral-angular-annotate@0.0.2, commander@1.1.1, esprima@1.0.4, escodegen@0.0.28)

gulp@3.8.7 node_modules\gulp
├── tildify@0.2.0
├── interpret@0.3.6
├── pretty-hrtime@0.2.1
├── deprecated@0.0.1
├── archy@0.0.2
├── minimist@0.2.0
├── semver@3.0.1
├── orchestrator@0.3.7 (sequencify@0.0.7, stream-consume@0.1.0, end-of-stream@0.1.5)
├── chalk@0.5.1 (escape-string-regexp@1.0.1, ansi-styles@1.1.0, supports-color@0.2.0, strip-ansi@0.3.0, has-ansi@0.1.0)
├── liftoff@0.12.1 (extend@1.3.0, resolve@0.7.4, findup-sync@0.1.3)
└── vinyl-fs@0.3.7 (graceful-fs@3.0.2, strip-bom@1.0.0, mkdirp@0.5.0, lodash@2.4.1, vinyl@0.4.2, through2@0.6.1, glob-stream@3.1.15, glob-watcher@0.0.6)

gulp-jshint@1.8.4 node_modules\gulp-jshint
├── lodash@2.4.1
├── rcloader@0.1.2 (rcfinder@0.1.8)
├── minimatch@0.3.0 (sigmund@1.0.0, lru-cache@2.5.0)
├── through2@0.5.1 (xtend@3.0.0, readable-stream@1.0.31)
└── jshint@2.5.5 (strip-json-comments@0.1.3, underscore@1.6.0, exit@0.1.2, console-browserify@1.1.0, shelljs@0.3.0, cli@0.6.4, htmlparser2@3.7.3)
```
向这种强制性的升级，对于开发者来说是很不友好的、很难接受的。一个稳定运行的应用，只是为了改动一个小功能，被这种霸王的条件强制升级，有可能应用的整个环境都被破坏了，其他的很多包也要跟着升级，代价很大啊！

#### 其他解决方案

我在测试中发现了，除了强制升级NPM以外，还有一种解决方案，就是利用CNPM代替NPM来进行依赖管理，也能够正常地下载依赖包。

CNPM 是一个Nodejs的库，致力于打造私有的 NPM 注册服务。当然，除了私有库功能以外，CNPM官网还提供了NPM同步的服务。CNPM的配置及使用，将在下一篇文章中介绍，请参考文章[CNPM搭建私有的NPM服务](http://blog.fens.me/nodejs-cnpm-npm/)。

让我们远离NPM包下载的错误吧，专心写好程序才是重点！









