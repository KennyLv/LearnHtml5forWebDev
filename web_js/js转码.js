
/*
javascript 使用btoa和atob来进行Base64转码和解码

javascript原生的api本来就支持,Base64,但是由于之前的javascript局限性，导致Base64基本中看不中用。当前html5标准正式化之际，Base64将有较大的转型空间,对于Html5 Api中出现的如FileReader Api, 拖拽上传,甚至是Canvas,Video截图都可以实现。
好了，前言说了一大堆，开发者需要重视：
*/
/*
一.我们来看看，在javascript中如何使用Base64转码
*/
var str = 'javascript';
window.btoa(str);
//转码结果 "amF2YXNjcmlwdA=="
window.atob("amF2YXNjcmlwdA==");
//解码结果 "javascript"

/*
二.对于转码来说，Base64转码的对象只能是字符串，因此来说，对于其他数据还有这一定的局限性，在此特别需要注意的是对Unicode转码。
*/
var str = "China，中国";
window.btoa(str);//Uncaught DOMException: Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.

/*
很明显，这种方式是不行的，那么如何让他支持汉字呢，这就要使用window.encodeURIComponent和window.decodeURIComponent
*/
var str = "China，中国";
window.btoa(window.encodeURIComponent(str));
//"Q2hpbmElRUYlQkMlOEMlRTQlQjglQUQlRTUlOUIlQkQ="
window.decodeURIComponent(window.atob('Q2hpbmElRUYlQkMlOEMlRTQlQjglQUQlRTUlOUIlQkQ='));
//"China，中国"

/*
1、encodeURI 和 decodeURI
先了解，什么是URI和URL。在电脑术语中，统一资源标识符（Uniform Resource Identifier，或URI)是一个用于标识某一互联网资源名称的字符串。 该种标识允许用户对网络中（一般指万维网）的资源通过特定的协议进行交互操作。URI由包括确定语法和相关协议的方案所定义。

统一资源定位符（或称统一资源定位器/定位地址、URL地址等，英语：Uniform / Universal Resource Locator，常缩写为URL），有时也被俗称为网页地址。如同在网络上的门牌，是因特网上标准的资源的地址（Address）。它最初是由蒂姆·伯纳斯-李发明用来作为万维网的地址。现在它已经被万维网联盟编制为因特网标准RFC 1738。

encodeURI：将字符串作为 URI 进行编码。
decodeURI：将encodeURI编码后的字符串进行解码。
encodeURI 特点：

不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码（ 即：- _ . ! ~ * ' ( ) ）。
目的是对 URI 全部的编码，因此对在 URI 中具有特殊含义的 ASCII 标点符号（即：;/?:@&=+$,#）是不会进行编码的。所以，此函数别名为 encodeURL 不为过，相当于 PHP 的 url_encode 。
例如：
*/
encodeURI("http://ydr.me?user=hello 云淡然");
// "http://ydr.me?user=hello%20%E4%BA%91%E6%B7%A1%E7%84%B6" 
decodeURI("http://ydr.me?user=hello%20%E4%BA%91%E6%B7%A1%E7%84%B6");
// http://ydr.me?user=hello 云淡然
//由于 encodeURI 是对 URL 的完整编码，所以常用于URL的跳转之处：
location.href=encodeURI('http://baidu.com/s?word=hello 云淡然');
// "http://baidu.com/s?word=hello%20%E4%BA%91%E6%B7%A1%E7%84%B6"
/*
在各个浏览器打开该地址，表现均不相同：
▲ ie的url表现的最规范（完全按照encodeURI编码）
▲ chrome的url表现比较规范（部分按照encodeURI编码）
▲ firefox的url表现最不规范（完全没有安装encodeURI编码）
虽然各个浏览器的URL表现均不相同，但在 firefox 和 chrome 中url的可读性最高，ie最低。
*/
/*
2、encodeURIComponent 和 decodeURIComponent
component：
adj. 组成的，构成的
n. 成分；组件；[电子] 元件
encodeURIComponent 与 encodeURI相比较，就多了 Component ，区别也很明显：

encodeURI 是对完整的URL进行编码，而 encodeURIComponent 是对URL的参数进行编码的，并且其编码特点如下：

不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码（即： - _ . ! ~ * ' ( ) ）。
目的是对 URI 部分的编码，因此对在 URI 中具有特殊含义的 ASCII 标点符号（即：;/?:@&=+$,#）是会进行编码的。
例如：
*/
encodeURIComponent("http://ydr.me?user=hello world");
// "http%3A%2F%2Fydr.me%3Fuser%3Dhello%20world"
decodeURIComponent("http%3A%2F%2Fydr.me%3Fuser%3Dhello%20world");
// http://ydr.me?user=hello world
/*
由于 encodeURIComponent 是对URL部分编码，因此常用于queryString（关于search更多阅读：/post/jquery-plugin-3-jquery-search-pase-url-search.html）、hashSearch、hashPath（关于hash更多阅读：/post/jquery-plugin-2-jquery-hash-parse-url-hash-and-listen-hashchange.html）以及Cookie（关于cookie更多阅读：/post/jquery-plugin-8-jquery-cookie.html）中，如：
*/
// queryString 编码
"http://ydr.me?from=" + encodeURIComponent("http://baidu.com");
// "http://ydr.me?from=http%3A%2F%2Fbaidu.com"
// hashSearch、hashPath 编码
"http://ydr.me#?from=" + encodeURIComponent("http://baidu.com");
// "http://ydr.me#?from=http%3A%2F%2Fbaidu.com"
"http://ydr.me#!from/" + encodeURIComponent("http://baidu.com");
// "http://ydr.me#!from/http%3A%2F%2Fbaidu.com"
// cookie 编码
document.cookie = "from=" + encodeURIComponent("http://baidu.com");
// "from=http%3A%2F%2Fbaidu.com"

/*
3、escape 和 unescape
escape 与 encodeURI 和 encodeURIComponent 类似，都是对字符串进行编码。不同点在于该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号（即： * @ - _ + . / ）进行编码，其他所有的字符都会被转义序列替换。

注意：ECMAScript v3 反对使用该方法，应用使用 decodeURI() 和 decodeURIComponent() 替代它。
虽然该方法已经被不推荐使用，但还是有一些特殊用途的，尤其是对中文的编码：
*/
encodeURI("hello @云淡然");
// 编码了空格、中文
// "hello%20@%E4%BA%91%E6%B7%A1%E7%84%B6"
encodeURIComponent("hello @云淡然");
// 编码了空格、@符合以及中文
// "hello%20%40%E4%BA%91%E6%B7%A1%E7%84%B6"
escape("hello @云淡然");
// 编码了空格、@符合以及中文
// "hello%20@%u4E91%u6DE1%u7136"
// 如上，encodeURI 和 encodeURIComponent 的编码结果几乎是一致的，但 escape 的中文编码却大相径庭。
// unescape 是 escape 的反函数，作用是用于解码 escape 编码后的字符串。

/*
4、btoa 和 atob
btoa：将ascii字符串或二进制数据转换成一个base64编码过的字符串，该方法不能直接作用于Unicode字符串。
atob：将已经被base64编码过的数据进行解码。
注意：因为btoa仅将ascii字符串或二进制数据进行编码，不能作用于unicode字符串，所以对中文的base64编码会报错：
*/
btoa("hello @云淡然");
// InvalidCharacterError: 'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.
// 如果要对中文进行base64编码，只需要将中文进行 encodeURIComponent 进行编码之后再进行 base64编码即可。
btoa(encodeURIComponent("hello @云淡然"));
// "aGVsbG8lMjAlNDAlRTQlQkElOTElRTYlQjclQTElRTclODQlQjY="
//完整的utf8编码字符串进行base64编码示例：
// 完整的utf8字符串base64编码与解码
function uft8ToBase64(utf8) {
	return btoa(encodeURIComponent(utf8));
}
function base64ToUtf8(base64) {
	return decodeURIComponent(atob(base64));
}
var base64 = uft8ToBase64("hello @云淡然");
// "aGVsbG8lMjAlNDAlRTQlQkElOTElRTYlQjclQTElRTclODQlQjY="
base64ToUtf8(base64);
// "hello @云淡然"

/*
5、参考资料
http://javascript.ruanyifeng.com/stdlib/string.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/decodeURI
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
https://developer.mozilla.org/zh-CN/docs/DOM/window.btoa
https://developer.mozilla.org/zh-CN/docs/DOM/window.atob
*/