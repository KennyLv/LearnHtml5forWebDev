/***************************************  
JS中使用sort结合localeCompare实现中文排序实例
***************************************/  
/*
sort 方法：用于对数组进行排序
arrayobj.sort(sortfunction)
参数
arrayObj 必选项。任意 Array 对象。
sortFunction 可选项。是用来确定元素顺序的函数的名称。如果这个参数被省略，那么元素将按照 ASCII 字符顺序进行升序排列。

当把 < 和 > 运算符应用到中文字符串时，sort函数只用字符的 Unicode 编码比较字符串，而不考虑当地的排序规则。以这种方法生成的顺序不一定是正确的。而localeCompare() 方法提供的比较字符串的方法，考虑了默认的本地排序规则。

localeCompare 方法：返回一个值，指出在当前的区域设置中两个字符串是否相同。
stringVar.localeCompare(stringExp)
参数
stringVar 必选项。一个 String 对象后文字。
stringExp 必选项。将与 stringVar 进行比较的字符串。
返回值
如果 stringVar 排序在 stringExp 之前，那么 localeCompare 返回 –1；
如果 stringVar 排序在 stringExp 之后，则返回 +1。
如果返回值为 0，那就说明这两个字符串是相同的。
*/

function sortArray(){
		var arrayTest = ["z", 5, 2, "a", 32, 3];
		// 默认情况下sort()方法会使Array中的数组按照ASCII码的顺序进行排列，容易出错
		arrayTest.sort();
		alert(arrayTest.toString());     //output:2,3,32,5,a,z
		// 数组倒序的方法reverse()。
		arrayTest.reverse();
		alert(arrayTest.toString());    //output:z,a,5,32,3,2
}
sortArray();
 
/**
* 比较函数
* @param {Object} param1 要比较的参数1
* @param {Object} param2 要比较的参数2
* @return {Number} 如果param1 > param2 返回 1
*                     如果param1 == param2 返回 0
*                     如果param1 < param2 返回 -1
*/
function compareFunc(param1,param2){
		//如果两个参数均为字符串类型
		if(typeof param1 == "string" && typeof param2 == "string"){
				return param1.localeCompare(param2);
		}
		//如果参数1为数字，参数2为字符串
		if(typeof param1 == "number" && typeof param2 == "string"){
				return -1;
		}
		//如果参数1为字符串，参数2为数字
		if(typeof param1 == "string" && typeof param2 == "number"){
				return 1;
		}
		//如果两个参数均为数字
		if(typeof param1 == "number" && typeof param2 == "number"){
				if(param1 > param2) return 1;
				if(param1 == param2) return 0;
				if(param1 < param2) return -1;
		}
}

/**
localeCompare()方法的用法，该方法是对字符串进行排序的方法，只有一个参数即要比较的字符串。
具体说明如下:
1、如果String对象按照字母顺序排在参数中的字符串之前，返回负数
2、如果String对象按照字符顺序排在参数中的字符串之后，返回正数
3、如果String对象等于参数中的字符串返回0
除此之外，localeCompare()方法还有一个独特之处，这个独特之处可以在其方法签名locale(现场、当地)上得以体现，也就是说他的实现时按照区域特性来的：
	如果在英语体系中，他的实现可能是按照字符串升序，
	如果在汉语中，他的实现则是按照首字母的拼音。
*/

var testArray = ["脚","本","之","家"];
document.write(testArray.sort(
		function compareFunction(param1,param2){
				return param1.localeCompare(param2);  //output:之,家,本,脚
		}
));

function startSort(){
		testArray.sort();
		testArray.sort(function(a,b){return a.localeCompare(b)});//汉字拼音排序方法
}

var testArray3 = [
    {
        "name": "免费集",
        "index": 0
    },
    {
        "name": "成极光",
        "index": 1
    },
    {
        "name": "推送SD",
        "index": 3
    },
    {
        "name": "APP实",
        "index": 4
    },
    {
        "name": "现高安",
        "index": 5
    },
    {
        "name": "全、高",
        "index": 6
    },
    {
        "name": "并发的",
        "index": 7
    },
    {
        "name": "推送功能",
        "index": 8
    },
    {
        "name": "appdsa",
        "index": 4
    }
];
testArray2.sort(function(a,b){return a.name.localeCompare(b.name)});

