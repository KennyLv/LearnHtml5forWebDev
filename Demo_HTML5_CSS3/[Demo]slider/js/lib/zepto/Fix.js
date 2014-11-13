
var Transition = {
	linear: function(t, b, c, d){
		return c*t/d + b;
	},
	quadIn: function(t, b, c, d){
		return c*(t/=d)*t + b;
	},
	quadOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},
	quadInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	cubicIn: function(t, b, c, d){
		return c*(t/=d)*t*t + b;
	},
	cubicOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	cubicInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	quartIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t + b;
	},
	quartOut: function(t, b, c, d){
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	quartInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	quintIn: function(t, b, c, d){
		return c*(t/=d)*t*t*t*t + b;
	},
	quintOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	quintInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	sineIn: function(t, b, c, d){
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	sineOut: function(t, b, c, d){
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	expoIn: function(t, b, c, d){
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	expoOut: function(t, b, c, d){
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	expoInOut: function(t, b, c, d){
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	circIn: function(t, b, c, d){
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	circOut: function(t, b, c, d){
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	circInOut: function(t, b, c, d){
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	elasticIn: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	elasticInOut: function(t, b, c, d, a, p){
		if (t==0) return b; if ((t/=d/2)==2) return b+c; if (!p) p=d*(.3*1.5); if (!a) a = 1;
		if (a < Math.abs(c)){ a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin(c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	backIn: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	backInOut: function(t, b, c, d, s){
		if (!s) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){
		return c - Transition.bounceOut (d-t, 0, c, d) + b;
	},
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)){
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)){
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)){
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	bounceInOut: function(t, b, c, d){
		if (t < d/2) return Transition.bounceIn(t*2, 0, c, d) * .5 + b;
		return Transition.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};



var opt = Object.prototype.toString,
isFun = function(f){return opt.call(f)==="[object Function]"},
isNum = function(f){return opt.call(f)==="[object Number]"},
isArr = function(f){return opt.call(f)==="[object Array]"},
isObj = function(o){return opt.call(o)==="[object Object]"},
isStr = function(o){return opt.call(o)==="[object String]"},
trim = function( text ){return (text || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );};

;;(function(){
/*var opt = Object.prototype.toString,
isFun = function(f){return opt.call(f)==="[object Function]"},
isObj = function(o){return opt.call(o)==="[object Object]"};*/
window['$Class'] = {
    //创建一个类  混合构造函数/原型方式
    create: function(config) {
        var obj = function(){},config = config||{};
        //过滤构造方法和原型方法
        obj = obj.prototype.constructor = config["__"]||obj;
        delete config["__"];
        obj.prototype = config;
        return obj;
    },
    //继承  混合对象冒充/原型链方式
    inherit:function(source,extd) {
        if(!isFun(source))return;
        var obj = source,extd = extd||{},pty = {};
        //过滤构造方法和原型方法
        obj = extd["__"]||obj;
        delete extd["__"];
        pty = extd;
        //对象冒充
        var exobj = function(){
            source.apply(this,arguments);
            obj.apply(this,arguments);
        };
        //原型链
        exobj.prototype = new source();
        //原型扩展
        exobj.prototype = source.prototype;
        this.include(exobj,pty);
        exobj.prototype.constructor = obj;
        return exobj;
    },
    //原型扩展
    include:function(target,ptys){
        if(!isFun(target)){target = function(){};}
        if(isObj(ptys)){
            for(k in ptys){
                target.prototype[k] = ptys[k];
            }
        }
        return target;
    }
};
})();


var FxBase = $Class.create({
	__:function(elem,options){
		var noop = function(){},from = {};
		this.elem = elem;
		this.options = this.mix({
			from:{},
			to:{},
			transition:function(t, b, c, d){
				return c*t/d + b;
			},
			onAnim:noop,
			onStart:noop,
			onStop:noop,
			onPause:noop,
			onResume:noop,
			duration:800,
			fps:45
		},options||{});

		for(var p in this.options.to){
			from[p] = this.getStyle(this.elem,p);
		}
		this.options.from = this.mix(from,this.options.from||{});
	},
	mix:function(){
		var args = arguments;
		if(args.length<1)return {};
		if(args.length==1)return args[0];
		for(var i=1;i<args.length;i++){
			for(var k in args[i]){
				args[0][k] = args[i][k];
			}
		}
		return args[0];
	},
	animate:function(duration){
		var that = this,
		endTime =  new Date().getTime()+duration;

		that.timer = setInterval(function(){
			var now = new Date().getTime();
			if (now < endTime){
				that.laveTime = endTime-now;
				var cssNow = that.compute(that.laveTime);
				for(var k in cssNow){
					that.setStyle(that.elem,k,cssNow[k]);
				}
				that.options.onAnim.call(that,cssNow);
			}else{
				that.stop();
			}
		}, Math.round(1000/that.options.fps));
		return that;
	},
	compute:function(time){
		var cssNow = {};
		for(var p in this.options.to){
			var from =  parseFloat(this.options.from[p]);
			var to = parseFloat(this.options.to[p]);
			cssNow[p] = this.options.transition(
				time,
				to,
				from-to,
				this.options.duration
			)+"px";
		}
		return cssNow;
	},
	reset:function(){
		for(var p in this.options.from){
			this.setStyle(this.elem,p,this.options.from[p]);
		}
	},
	start:function(){
		clearInterval(this.timer);
		this.timer = null;
		this.animate(this.laveTime = this.options.duration);
		this.options.onStart.apply(this);
		return this;
	},
	stop:function(pos){
		clearInterval(this.timer);
		this.timer = null;
		if(pos){
			this.reset();
		}else{
			try{
			for(var p in this.options.to){
				this.setStyle(this.elem,p,this.options.to[p]);
			}
			}catch(e){this.error(e);}
		}
		this.laveTime = 0;
		this.options.onStop.apply(this);
		return this;
	},
	pause:function(){
		clearInterval(this.timer);
		this.timer = null;
		this.options.onPause.apply(this);
		return this;
	},
	resume:function(){
		clearInterval(this.timer);
		this.timer = null;
		this.animate(this.laveTime);
		this.options.onResume.apply(this);
		return this;
	},
	getStyle: function(elem, key) {
		var ret, style = elem.style;
		try{
		if((!+"\v1") && key === 'opacity' && elem.currentStyle) {
			ret =  ((/opacity=(\d+)/i.exec(elem.currentStyle.filter || '') ||
			parseInt(['', '100'])[1] / 100)) + '';

			return ret;
		}
		if(/float/i.test(key)) {
			key = (!+"\v1") ? 'styleFloat' : 'cssFloat';
		}
		/*if(style && style[key]) {
			ret = style[key];
			非firefox浏览器下.left还需完善
		} else */
		if(document.defaultView && document.defaultView.getComputedStyle) {
			if(/float/i.test(key)) {
				key = 'float';
			}
			var defaultView = elem.ownerDocument.defaultView;
			if(!defaultView) { return null; }
			var computedStyle = defaultView.getComputedStyle(elem, null);
			if(computedStyle) {
				ret = computedStyle[key]||computedStyle[this.camelize(key)]||computedStyle[this.camelize(key,true)];
				//尝试用不同命名规则获取样式
			}
			// We should always get a number back from opacity
			if(key === 'opacity' && ret === '') { ret = '1'; }
		} else if(elem.currentStyle) {
			var camelCase = this.camelize(key);
			ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
			if( !/^-?\d+(?:px)?$/i.test(ret) && /^-?\d/.test(ret) ) {//单位转换
				var left = style.left, rsLeft = elem.runtimeStyle.left;
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === 'fontSize' ? '1em' : (ret || 0);
				ret = style.pixelLeft + 'px';
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}
		}catch(e){
			this.error(e);
		}
		return ret;
	},
	setStyle: function(elem, style, value) {
		try{
			var hash = {};
			if ( value ) { hash[ style ] = value; }
			else if (isStr(style)) {
				for(var s in style.split(';')){
					var els = option.split(':');
					if ( els[0] && els[1] ) {
						hash[trim(els[0])] = trim(els[1]);
					}
				}
			}
			for (var name in hash) {
				var value = hash[name];
				if (name === 'opacity' && !+"\v1") {
					elem.zoom = 1;
					elem.style.filter = (elem.currentStyle.filter || '').replace( /alpha\([^)]*\)/, '' ) +
						'alpha(opacity=' + value * 100 + ')';
				} else if (name === 'float') {
					elem.style[ !+"\v1" ? 'styleFloat' : 'cssFloat' ] = value;
				} else {
					elem.style[ this.camelize(name) ] = value;

					elem.style[ this.camelize(name,true) ] = value;//ff 修复命名规则
				}
			}
		}catch(e){
			this.error(e);
		}
	},
	camelize:function( text , f) {//-_命名转驼峰命名
		var prefix = !!f ? '' : (text.match(/^(\-|_)+?/g) || '');
		return prefix + text.substr(prefix.length, text.length).replace(
			/(\-|_)+?(\D)/g, function(match) {
			return match.replace(/\-|_/,'').toUpperCase();
		});
	},
	error:function(){
		if(typeof console !="undefined"){
			console.error(arguments[0]);
		}
	}
});

var Fx = $Class.inherit(FxBase,{
	__:function(){
		this.filter();
	},
	compute:function(time){
		var cssNow = {};
		for(var p in this.options.to){

			var ofrom = this.detach(this.options.from[p]);
			var oto = this.detach(this.options.to[p]);

			if(ofrom && oto ){
				var temp = [];
				for(var m=0;m<oto.data.length;m++){
					temp.push(this.options.transition(
						time,
						oto.data[m],
						ofrom.data[m]-oto.data[m],
						this.options.duration
					));
				}
				cssNow[p] = this.colorFix(oto.fn(temp));
			}
		}
		return cssNow;
	},
	filter:function(){
		var rehexColor =  /#(([a-fA-F0-9]{3}){1,2})/;
		var regNum = /(-?\d+\.?\d*)/;
		var indexfrom = [], indexto =[];
		for(var p in this.options.from){
			indexfrom.push(p);

			if( rehexColor.test(this.options.from[p]) ) {
				this.options.from[p] = this.parseRGB(this.options.from[p]);
			}else if(!regNum.test(this.options.from[p])){
				delete this.options.from[p];
			}
		}

		for(var p in this.options.to){
			indexto.push(p);
			if(rehexColor.test(this.options.to[p])){
				this.options.to[p] = this.parseRGB(this.options.to[p]);
			}else if(!regNum.test(this.options.to[p])){
				delete this.options.to[p];
			}
		}
	},
	detach:function(str){//分离数字和模版方法
		str+="";
		var regNum = /(-?\d+\.?\d*)/gi;
		if(regNum.test(str)){
			var arrNum = [];
			var strTemplate = str.replace(regNum,(function(m){
				var i = 0;
				return function(m){
					arrNum.push(parseFloat(m));
					return "{$"+(i++)+"}";
				}
			})());
			return {
				data:arrNum,
				fn:function(arr){
					for(var n=0;n<arr.length;n++){
						strTemplate = strTemplate.replace(new RegExp("\\{\\$"+n+"\\}"),arr[n])
					}
					return strTemplate;
				}
			};
		}
	},
	parsePixel:function(val){//单位转换为像素px
		val = trim(val);
		elem = this.elem;
		var reunit =  /^(-?\d*\.?\d*){1}(em|ex|in|cm|mm|pt|pc|%)?$/gi;
		if( reunit.test(val) ) {
			try{
				if(elem.runtimeStyle){
					var left = elem.style.left, rsLeft = elem.runtimeStyle.left;

					elem.runtimeStyle.left = elem.currentStyle.left;
					elem.style.left = val || 0;
					val = elem.style.pixelLeft + 'px';

					elem.style.left = left;
					elem.runtimeStyle.left = rsLeft;
				}else if(elem.ownerDocument.defaultView.getComputedStyle){
					var left = elem.style.left;

					elem.style.left = val || 0;
					val = elem.ownerDocument.defaultView.getComputedStyle(elem, null)["left"];
					elem.style.left = left;
				}
			}catch(e){}

		}
		return val;
	},
	parseRGB:function(val){
		var rehexColor =  /(#([a-fA-F0-9]{3}){1,2})/gi;
		val = val.replace(rehexColor,function(m){
			rehexColor.exec(val);//修复IE ff
			var hex = RegExp.$2.split("");
			var a = [];
			if(hex.length===3){
				for(var i=0;i<hex.length;i++){
					a.push(parseInt(hex[i]+""+hex[i],16));
				}
			}else if(hex.length===6){
				for(var i=0;i<hex.length;i+=2){
					a.push(parseInt(hex[i]+""+hex[i+1],16));
				}
			}
			return m.replace(RegExp.$1,"rgb("+a.join(",")+")");
		});
		return val;
	},
	colorFix:function(val){
		var reRGBColor = /((rgb|rgba)\((.+?)\))/ig;
		var reHSLColor = /((hsl|hsla)\((.+?)\))/ig;
		
		val = val.replace(reRGBColor,function(m){
			reRGBColor.exec(val);//修复IE ff
			var arr = RegExp.$3.split(",");
			for(var i=0;i<3;i++){
				arr[i] = 255-Math.abs(255-Math.abs(Math.floor(arr[i])))%256;
				//Math.abs(Math.floor(arr[i]));
			}
			return m.replace(RegExp.$1,RegExp.$2+"("+arr.join(",")+")");
		});
		
		val = val.replace(reHSLColor,function(m){
			reHSLColor.exec(val);//修复IE ff
			var arr = RegExp.$3.split(",");
			//arr[0] = 360-Math.abs(360-Math.abs(parseFloat(arr[0])))%360;
			for(var i=1;i<3;i++){
				arr[i] = 100-Math.abs(100-Math.abs(parseFloat(arr[i])))%100 +"%";
			}
			return m.replace(RegExp.$1,RegExp.$2+"("+arr.join(",")+")");
		});
		return val;
	}
});






