consoel.log("js如何判断一个对象{}是否为空对象，没有任何属性");

//前段时间用js写了一个类似"angularjs"用于数据绑定的东西，功能是比较简单了，
//通常应该传进来的是一个ArrayList JSON对象数组，
//但有时候通过AJAX方法调用返回的是一个JSON对象，而不是数组！
//为了兼容这种情况使用了以下代码：

if (typeof model.rows === "object" && !(model.rows instanceof Array)){  
    model.rows = [model.rows];  
  
}  
//这段代码在后来使用过程中发现了一个Bug，就是当
model.rows = {};  
//时，依然把它当作一个有效的对象来处理，进行数据绑定，可想而知，所有数据都是空的。
//这时想起之前写过遍历JS对象属性的方法，这里可以用上了！
if (typeof model.rows === "object" && !(model.rows instanceof Array)){  
    var hasProp = false;  
    for (var prop in model.rows){  
        hasProp = true;  
        break;  
    }  
    if (hasProp){  
        model.rows = [model.rows];  
    }else{  
        throw "model.rows is empty object";  
        return false;  
    }  
}  


function isEmpty(value) {
  return (Array.isArray(value) && value.length === 0) 
      || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}

function isEmpty(value) {
    return Object.keys(value).length === 0;
}


//如果json返回是数组的话，用length是可以判断的，如果是判断是否是空对象可以参考下jquery的isEmptyObject方法。比如json为{}的时候。这个原理实现也很简单：

isEmptyObject: function( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}


{}.toString.call(o) === '[object Array]';

function isUndefined(variable) {
    return typeof variable == 'undefined' ? true : false;
}





