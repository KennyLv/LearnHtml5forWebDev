(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Const = function() { };
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
};
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
var Main = function() { };
Main.main = function() {
	framework.style.Prefix.init();
	page.Mode.init();
	framework.user.Size.init();
	framework.event.Window.init({ resize : true});
	var pageController = new page.Controller();
	parts.Mario.init();
	var next = pageController.checkURL();
	if(next == page.Type.TOP) next = page.Type.INTRO;
	framework.event.Window.addEvent(framework.event.EventType.LOAD,function() {
		pageController.changePage(next);
	});
};
var Reflect = function() { };
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringTools = function() { };
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var framework = {};
framework.Elements = function() { };
framework.Elements.get = function(elm,tag) {
	framework.Elements.arry = elm.getElementsByTagName(tag);
	return framework.Elements.arry;
};
framework.Flag = function(keys) {
	this._value = { };
	this._status = { };
	var _g1 = 0;
	var _g = keys.length - 1;
	while(_g1 < _g) {
		var i = _g1++;
		this._status[keys[i]] = true;
		this._value[keys[i]] = 0;
	}
};
framework.Flag.prototype = {
	getValue: function(key) {
		if(Object.prototype.hasOwnProperty.call(this._status,key)) {
			if(Reflect.getProperty(this._status,key)) return false;
			return Reflect.getProperty(this._value,key);
		}
		return false;
	}
	,setValue: function(key,value) {
		if(Object.prototype.hasOwnProperty.call(this._status,key)) {
			this._value[key] = value;
			this._status[key] = false;
		}
	}
	,onStatus: function(key) {
		if(Object.prototype.hasOwnProperty.call(this._status,key)) this._status[key] = true;
	}
};
framework.FunctionList = function() {
	this._pause = [];
	this._funcs = { };
	this._length = 0;
	this._num = 0;
};
framework.FunctionList.prototype = {
	add: function(func) {
		var n = this._num;
		this._funcs[n + ""] = func;
		this._pause[n] = n;
		this._num = n + 1;
		return n;
	}
	,addAndStart: function(func) {
		var n = this._num;
		this._num = n + 1;
		this._funcs[n + ""] = func;
		this._length++;
		if(this._length == 1) return [n,true]; else return [n,false];
	}
	,reset: function(num,func) {
		if(Object.prototype.hasOwnProperty.call(this._funcs,num + "")) {
			this._funcs[num + ""] = func;
			return true;
		}
		return false;
	}
	,start: function(num) {
		if(this._pause[num] >= 0) {
			this._pause.splice(num,1);
			this._length++;
			if(this._length == 1) return true;
		}
		return false;
	}
	,stop: function(num) {
		if(this._pause[num] == null) {
			this._pause[num] = num;
			this._length--;
			return true;
		}
		return false;
	}
	,remove: function(num) {
		if(Object.prototype.hasOwnProperty.call(this._funcs,num + "")) {
			Reflect.deleteField(this._funcs,num + "");
			this._length--;
			return true;
		}
		return false;
	}
	,run: function() {
		var res = false;
		var fields = Reflect.fields(this._funcs);
		var key = "";
		var _g1 = 0;
		var _g = fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			key = fields[i];
			if(this._pause[Std.parseInt(key)] == null) {
				res = true;
				(Reflect.getProperty(this._funcs,key))();
			}
		}
		return res;
	}
};
framework.event = {};
framework.event.EventType = { __constructs__ : ["LOAD","SCROLL","RESIZE","BLUR","FOCUS"] };
framework.event.EventType.LOAD = ["LOAD",0];
framework.event.EventType.LOAD.__enum__ = framework.event.EventType;
framework.event.EventType.SCROLL = ["SCROLL",1];
framework.event.EventType.SCROLL.__enum__ = framework.event.EventType;
framework.event.EventType.RESIZE = ["RESIZE",2];
framework.event.EventType.RESIZE.__enum__ = framework.event.EventType;
framework.event.EventType.BLUR = ["BLUR",3];
framework.event.EventType.BLUR.__enum__ = framework.event.EventType;
framework.event.EventType.FOCUS = ["FOCUS",4];
framework.event.EventType.FOCUS.__enum__ = framework.event.EventType;
framework.event.Window = function() { };
framework.event.Window.init = function(option) {
	if(option != null) framework.event.Window.setOption(option);
	window.onload = function(e) {
		if(framework.event.Window._option.scroll) window.onscroll = framework.event.Window.setEvent(framework.event.EventType.SCROLL);
		if(framework.event.Window._option.resize) window.onresize = framework.event.Window.setEvent(framework.event.EventType.RESIZE);
		if(framework.event.Window._option.blur) window.onblur = framework.event.Window.setEvent(framework.event.EventType.BLUR);
		if(framework.event.Window._option.focus) window.onfocus = framework.event.Window.setEvent(framework.event.EventType.FOCUS);
		framework.event.Window.runEvent(framework.event.EventType.LOAD);
	};
};
framework.event.Window.setOption = function(option) {
	var _g = 0;
	var _g1 = Reflect.fields(option);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		Reflect.setField(framework.event.Window._option,key,Reflect.field(option,key));
	}
};
framework.event.Window.setEvent = function(type) {
	var res = function(e) {
		framework.event.Window.runEvent(type);
	};
	return res;
};
framework.event.Window.addEvent = function(type,func) {
	return framework.event.Window.getFuncList(type).addAndStart(func)[0];
};
framework.event.Window.resetEvent = function(type,num,func) {
	return framework.event.Window.getFuncList(type).reset(num,func);
};
framework.event.Window.startEvent = function(type,num) {
	return framework.event.Window.getFuncList(type).start(num);
};
framework.event.Window.stopEvent = function(type,num) {
	return framework.event.Window.getFuncList(type).stop(num);
};
framework.event.Window.removeEvent = function(type,num) {
	return framework.event.Window.getFuncList(type).remove(num);
};
framework.event.Window.runEvent = function(type) {
	return framework.event.Window.getFuncList(type).run();
};
framework.event.Window.getFuncList = function(type) {
	switch(type[1]) {
	case 0:
		return framework.event.Window._loadFunc;
	case 1:
		return framework.event.Window._scrollFunc;
	case 2:
		return framework.event.Window._resizeFunc;
	case 3:
		return framework.event.Window._blurFunc;
	case 4:
		return framework.event.Window._focusFunc;
	}
};
framework.style = {};
framework.style.PropertyList = { __constructs__ : ["TRANSFORM","TRANSITION","ANIMATION"] };
framework.style.PropertyList.TRANSFORM = ["TRANSFORM",0];
framework.style.PropertyList.TRANSFORM.__enum__ = framework.style.PropertyList;
framework.style.PropertyList.TRANSITION = ["TRANSITION",1];
framework.style.PropertyList.TRANSITION.__enum__ = framework.style.PropertyList;
framework.style.PropertyList.ANIMATION = ["ANIMATION",2];
framework.style.PropertyList.ANIMATION.__enum__ = framework.style.PropertyList;
framework.style.Prefix = function() { };
framework.style.Prefix.init = function() {
	if(document.head != null) framework.style.Prefix._style = document.head.style; else framework.style.Prefix._style = document.getElementsByTagName("head")[0].style;
	framework.style.Prefix.transform = framework.style.Prefix.setPrefix(framework.style.Prefix.transform);
	framework.style.Prefix.transition = framework.style.Prefix.setPrefix(framework.style.Prefix.transition);
	framework.style.Prefix.animation = framework.style.Prefix.setPrefix(framework.style.Prefix.animation);
};
framework.style.Prefix.setPrefix = function(property) {
	if(framework.style.Prefix._style[property] != undefined) return property;
	var prop = property.charAt(0).toUpperCase() + property.slice(1);
	var _g = 0;
	var _g1 = framework.style.Prefix._pre;
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		if(framework.style.Prefix._style[i + prop] != undefined) return i + prop;
	}
	return "";
};
framework.style.Prefix.getValue = function(elm,type,sup) {
	if(sup == null) sup = "";
	return elm.style[framework.style.Prefix.getProperty(type) + sup];
};
framework.style.Prefix.setValue = function(elm,type,value,sup) {
	if(sup == null) sup = "";
	var name = framework.style.Prefix.getProperty(type) + sup;
	if(elm.style[name] != undefined) elm.style[name] = value;
};
framework.style.Prefix.getProperty = function(type) {
	switch(type[1]) {
	case 0:
		return framework.style.Prefix.transform;
	case 1:
		return framework.style.Prefix.transition;
	case 2:
		return framework.style.Prefix.animation;
	}
};
framework.user = {};
framework.user.OS = function() {
	this.ver = "0.0";
	this.type = "other";
};
framework.user.OS.prototype = {
	check: function(v) {
		var a = v.split(".");
		var b = this.ver.split(".");
		var I;
		if(a.length > b.length) I = a.length; else I = b.length;
		var aa;
		var bb = 0;
		var _g1 = 0;
		var _g = I - 1;
		while(_g1 < _g) {
			var i = _g1++;
			aa = 0;
			bb = 0;
			if(a[i] != null) aa = Std.parseInt(a[i]);
			if(b[i] != null) bb = Std.parseInt(b[i]);
			if(aa > bb) return false;
			if(aa < bb) return true;
		}
		return true;
	}
};
framework.user.Browser = function() {
	this.ie = false;
	framework.user.OS.call(this);
};
framework.user.Browser.__super__ = framework.user.OS;
framework.user.Browser.prototype = $extend(framework.user.OS.prototype,{
});
framework.user.Device = function() {
	this.android = false;
	this.type = "pc";
};
framework.user.Size = function() { };
framework.user.Size.init = function() {
	framework.user.Size.screenWidth = framework.user.Size._wd.screen.width;
	framework.user.Size.screenHeight = framework.user.Size._wd.screen.height;
	framework.user.Size.availWidth = framework.user.Size._wd.screen.availWidth;
	framework.user.Size.availHeight = framework.user.Size._wd.screen.availHeight;
	framework.user.Size.pixelRatio = framework.user.Size._wd.devicePixelRatio;
	if(framework.user.Size.pixelRatio != null && framework.user.Size.pixelRatio == 2) framework.user.Size.retina = true; else framework.user.Size.retina = false;
	framework.event.Window.setOption({ resize : true, scroll : true});
	framework.event.Window.addEvent(framework.event.EventType.RESIZE,framework.user.Size.onAllFlag);
	framework.event.Window.addEvent(framework.event.EventType.SCROLL,framework.user.Size.onPositionFlag);
};
framework.user.Size.width = function() {
	var res = framework.user.Size._values.getValue("width");
	if(res != false) return res;
	res = framework.user.Size._dc.documentElement.clientWidth;
	framework.user.Size._values.setValue("width",res);
	return res;
};
framework.user.Size.height = function() {
	var res = framework.user.Size._values.getValue("height");
	if(res != false) return res;
	res = framework.user.Size._dc.documentElement.clientHeight;
	framework.user.Size._values.setValue("height",res);
	return res;
};
framework.user.Size.clientWidth = function() {
	var res = framework.user.Size._values.getValue("clientWidth");
	if(res != false) return res;
	res = Math.max.apply(null,[framework.user.Size._bd.clientWidth,framework.user.Size._bd.scrollWidth,framework.user.Size._dc.documentElement.scrollWidth,framework.user.Size._dc.documentElement.clientWidth]);
	framework.user.Size._values.setValue("clientWidth",res);
	return res;
};
framework.user.Size.clientHeight = function() {
	var res = framework.user.Size._values.getValue("clientHeight");
	if(res != false) return res;
	res = Math.max.apply(null,[framework.user.Size._bd.clientHeight,framework.user.Size._bd.scrollHeight,framework.user.Size._dc.documentElement.scrollHeight,framework.user.Size._dc.documentElement.clientHeight]);
	framework.user.Size._values.setValue("clientHeight",res);
	return res;
};
framework.user.Size.top = function() {
	var res = framework.user.Size._values.getValue("top");
	if(res != false) return res;
	res = framework.user.Size._dc.documentElement.scrollTop || framework.user.Size._bd.scrollTop;
	framework.user.Size._values.setValue("top",res);
	return res;
};
framework.user.Size.left = function() {
	var res = framework.user.Size._values.getValue("left");
	if(res != false) return res;
	res = framework.user.Size._dc.documentElement.scrollLeft || framework.user.Size._bd.scrollLeft;
	framework.user.Size._values.setValue("left",res);
	return res;
};
framework.user.Size.onSizeFlag = function() {
	framework.user.Size._values.onStatus("width");
	framework.user.Size._values.onStatus("height");
	framework.user.Size._values.onStatus("clientWidth");
	framework.user.Size._values.onStatus("clientHeight");
};
framework.user.Size.onPositionFlag = function() {
	framework.user.Size._values.onStatus("top");
	framework.user.Size._values.onStatus("left");
};
framework.user.Size.onAllFlag = function() {
	var _g1 = 0;
	var _g = framework.user.Size._keys.length;
	while(_g1 < _g) {
		var i = _g1++;
		framework.user.Size._values.onStatus(framework.user.Size._keys[i]);
	}
};
framework.user.UserAgent = function() {
	this._isAndroid = false;
	this._android = "";
	this._deviceType = "pc";
};
framework.user.UserAgent.init = function() {
	var dvList = [["iPhone","iOS","sp"],["iPad","iOS","tb"],["iPod","iOS","sp"],["BlackBerry","BlackBerry","sp"],["Windows Phone","Windows Phone","sp"],["Mac OS X","Mac","pc"],["Windows NT","Windows","pc"],["Windows 9","Windows","pc"]];
	var dvEReg = [new EReg("iPhone OS ((?:[0-9]+)(?:_(?:[0-9]+))*)",""),new EReg("CPU OS ((?:[0-9]+)(?:_(?:[0-9]+))*)",""),new EReg("CPU iPhone OS ((?:[0-9]+)(?:_(?:[0-9]+))*)",""),new EReg("BlackBerry[0-9]*/((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Windows Phone ((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Mac OS X ((?:[0-9]+)(?:(?:\\.|_)(?:[0-9]+))*)",""),new EReg("Windows NT ((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Windows ((?:[0-9]+)(?:\\.(?:[0-9]+))*)","")];
	var bwList = ["Chrome","Safari","Firefox","Opera"];
	var bwEReg = [new EReg("Chrome/((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Version/((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Firefox/((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""),new EReg("Version/((?:[0-9]+)(?:\\.(?:[0-9]+))*)","")];
	var _g1 = 0;
	var _g = dvList.length;
	while(_g1 < _g) {
		var i = _g1++;
		var v = dvList[i];
		if(framework.user.UserAgent.ua.indexOf(v[0]) >= 0) {
			framework.user.UserAgent.os.type = v[1];
			framework.user.UserAgent.device.type = v[2];
			framework.user.UserAgent.os.ver = framework.user.UserAgent.matchedVer(dvEReg[i]);
			break;
		}
	}
	var _g11 = 0;
	var _g2 = bwList.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		if(framework.user.UserAgent.ua.indexOf(bwList[i1]) >= 0) {
			framework.user.UserAgent.browser.type = bwList[i1];
			framework.user.UserAgent.browser.ver = framework.user.UserAgent.matchedVer(bwEReg[i1]);
			break;
		}
	}
	if(framework.user.UserAgent.ua.indexOf("Android") >= 0) {
		framework.user.UserAgent.os.type = "Android";
		framework.user.UserAgent.os.ver = framework.user.UserAgent.matchedVer(new EReg("Android ((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""));
		if(framework.user.UserAgent.ua.indexOf("Mobile") == -1 || framework.user.UserAgent.ua.indexOf("A1_07") > 0 || framework.user.UserAgent.ua.indexOf("SC-01C") > 0) framework.user.UserAgent.device.type = "tb"; else framework.user.UserAgent.device.type = "sp";
		framework.user.UserAgent.device.android = framework.user.UserAgent.matchedVer(new EReg("; ((?:(?!;).)*) Build",""),true);
	}
	if(framework.user.UserAgent.ua.indexOf("MSIE") >= 0) {
		framework.user.UserAgent.browser.ie = true;
		var _g3 = 6;
		while(_g3 < 10) {
			var i2 = _g3++;
			if(framework.user.UserAgent.ua.indexOf("MSIE " + i2) >= 0) {
				framework.user.UserAgent.browser.type = "MSIE" + i2;
				framework.user.UserAgent.browser.ver = framework.user.UserAgent.matchedVer(new EReg("MSIE ((?:[0-9]+)(?:\\.(?:[0-9]+))*)",""));
				break;
			}
		}
	} else if(framework.user.UserAgent.ua.indexOf("Trident/7") >= 0) {
		framework.user.UserAgent.browser.ie = true;
		framework.user.UserAgent.browser.type = "MSIE11";
		framework.user.UserAgent.browser.ver = framework.user.UserAgent.matchedVer(new EReg("rv:((?:[0-9]+)(?:_(?:[0-9]+))*)",""));
	}
};
framework.user.UserAgent.matchedVer = function(ereg,def) {
	if(def == null) def = "0.0";
	if(ereg.match(framework.user.UserAgent.ua)) return ereg.matched(1); else return def;
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var page = {};
page.About = function() {
	this._styles = [0,426,160];
	this._body = window.document.body;
	this._contentDom = new parts.Container("about");
	this._ttlBox = framework.Elements.get(this._contentDom.dom,"div")[0];
	this._ttl = framework.Elements.get(this._ttlBox,"h2")[0];
	this._txt = framework.Elements.get(this._contentDom.dom,"p")[0];
	this._resizeEventNum = framework.event.Window.addEvent(framework.event.EventType.RESIZE,$bind(this,this.setPosition));
};
page.About.prototype = {
	setPosition: function() {
		var wh = framework.user.Size.height();
		if(wh < 778) {
			if(wh < 708) this._styles[1] = 356; else this._styles[1] = 426 - (778 - wh);
			this._styles[0] = 188;
			this._styles[2] = 160;
		} else {
			this._styles[1] = 426;
			if(wh < 938) {
				this._styles[0] = 160 - (wh - 778) + 28;
				this._styles[2] = 160 + (wh - 778);
			} else {
				this._styles[0] = 28;
				this._styles[2] = 336;
			}
		}
		this._ttlBox.style.top = this._styles[0] + "px";
		this._ttl.style.height = this._styles[1] + "px";
		this._txt.style.height = this._styles[2] + "px";
	}
	,view: function(front) {
		if(front == null) front = false;
		this.setPosition();
		parts.Mario.changeMode(parts.ModeType.WALKING);
	}
	,'delete': function() {
		parts.Mario.hidden();
	}
};
page.Controller = function() {
	this._mode = page.Type.LOAD;
	this._loading = new page.Loading();
	this._intro = new page.Intro(this);
	this._top = new page.Top();
	this._about = new page.About();
	this._maker = new page.Maker();
	this._movie = new page.Movie();
	this._menu = new page.Menu(this);
	this._body = window.document.body;
	this._baseURL = StringTools.replace(window.location.pathname,"index.html","");
};
page.Controller.prototype = {
	setPopstateEvent: function() {
		var _g = this;
		if(window.history && window.history.pushState) window.onpopstate = function(e) {
			console.log("onpopstate");
			_g.changePage(_g.checkURL());
		}; else if(window.onhashchange) window.onhashchange = function(e1) {
			_g.changePage(_g.checkURL());
		};
	}
	,checkURL: function() {
		var hash = window.location.hash;
		switch(hash) {
		case "#/about/":
			return page.Type.ABOUT;
		case "#/maker/":
			return page.Type.MAKER;
		case "#/movie/":
			return page.Type.MOVIE;
		default:
			return page.Type.TOP;
		}
	}
	,checkMode: function(mode) {
		return this._mode == mode;
	}
	,changePage: function(mode) {
		if(this._mode != mode) {
			this._next = mode;
			this.deletePage();
		}
	}
	,viewPage: function(mode) {
		switch(mode[1]) {
		case 0:
			break;
		case 1:
			this._body.id = "page_intro";
			this._intro.play();
			break;
		case 2:
			this._top.view();
			this._body.id = "page_top";
			this.pushState("#/");
			break;
		case 3:
			this._about.view();
			this._body.id = "page_about";
			this.pushState("#/about/");
			break;
		case 4:
			this._maker.view();
			this._body.id = "page_maker";
			this._maker.play();
			this.pushState("#/maker/");
			break;
		case 5:
			this._movie.view();
			this._body.id = "page_movie";
			this.pushState("#/movie/");
			break;
		}
	}
	,pushState: function(hash) {
		if(window.history && window.history.pushState) history.pushState(null,null,hash); else location.hash = hash;
		ga("send","pageview",this._baseURL + hash.replace("#/","") + "index.html");
	}
	,deletePage: function() {
		var _g1 = this;
		var _g = this._mode;
		switch(_g[1]) {
		case 0:
			if(page.Mode.type == page.UserType.STANDARD) parts.Mario.changeMode(parts.ModeType.RUNNING,function() {
				_g1._loading.onloaded();
				_g1.toNextPage();
			}); else {
				this._timer = new haxe.Timer(2000);
				this._timer.run = function() {
					_g1._timer.stop();
					_g1._timer = null;
					_g1._loading.onloaded();
					parts.Mario.hidden();
					_g1.toNextPage();
				};
			}
			break;
		case 1:
			this._intro["delete"]();
			this._intro = null;
			this.toNextPage();
			this._menu.setFootLogoClick();
			this.setPopstateEvent();
			break;
		case 2:
			this._loading.show();
			this._top["delete"]();
			this.setNextPageTimer();
			break;
		case 3:
			this._loading.show();
			this._about["delete"]();
			this.setNextPageTimer();
			break;
		case 4:
			this._loading.show();
			this._maker["delete"]();
			this.setNextPageTimer();
			break;
		case 5:
			this._loading.show();
			this._movie["delete"]();
			this.setNextPageTimer();
			break;
		}
	}
	,toNextPage: function() {
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
		}
		this._mode = this._next;
		this.viewPage(this._mode);
	}
	,setNextPageTimer: function() {
		var _g = this;
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
		}
		this._timer = new haxe.Timer(1000);
		this._timer.run = function() {
			_g._timer.stop();
			_g._timer = null;
			_g.toNextPage();
			_g._loading.hidden();
		};
	}
};
page.Intro = function(controller) {
	var _g = this;
	this._controller = controller;
	this._contentDom = new parts.Container("intro");
	var skipBtn = framework.Elements.get(this._contentDom.dom,"a")[0];
	this._moviePlayer = new youtube.Player("introMovie","Hq6NTPvGL-s",800,450,false,1,function() {
		_g._moviePlayer.play();
	},function() {
		_g._controller.changePage(page.Type.TOP);
	});
	skipBtn.onclick = function(e) {
		if(_g._moviePlayer.loaded) _g._moviePlayer.pause();
		_g._controller.changePage(page.Type.TOP);
		return false;
	};
};
page.Intro.prototype = {
	play: function() {
		this._moviePlayer.create();
	}
	,'delete': function() {
		if(this._moviePlayer.loaded) this._moviePlayer.clear();
		this._contentDom["delete"]();
	}
};
page.Loading = function() {
	this._dom = window.document.getElementById("loading");
};
page.Loading.prototype = {
	onloaded: function() {
		this._dom.className = "hidden";
	}
	,show: function() {
		this._dom.className = "segment show";
	}
	,hidden: function() {
		this._dom.className = "segment hidden";
	}
};
page.Maker = function() {
	this._body = window.document.body;
	this._contents = window.document.getElementById("maker");
	this._slide = new parts.Slide();
	this._resizeEventNum = framework.event.Window.addEvent(framework.event.EventType.RESIZE,$bind(this,this.setPadding));
	framework.event.Window.stopEvent(framework.event.EventType.RESIZE,this._resizeEventNum);
};
page.Maker.prototype = {
	setPadding: function() {
		var wh = framework.user.Size.height();
		var p = "0 0 0 0";
		if(wh <= 938) p = "0 0 150px 0"; else {
			var n = (wh - 938) / 2;
			p = n + "px 0 " + (150 + n) + "px 0";
		}
		this._contents.style.padding = p;
	}
	,view: function(front) {
		if(front == null) front = false;
		this.setPadding();
		framework.event.Window.startEvent(framework.event.EventType.RESIZE,this._resizeEventNum);
		this._body.className = "scroll";
	}
	,play: function() {
		this._slide.restart();
	}
	,'delete': function() {
		var _g = this;
		framework.event.Window.stopEvent(framework.event.EventType.RESIZE,this._resizeEventNum);
		this._slide.movieStop();
		var timer = new haxe.Timer(500);
		timer.run = function() {
			_g._body.className = "";
			timer.stop();
			timer = null;
		};
	}
};
page.Menu = function(controller) {
	this._currentNum = 0;
	this._pageList = [page.Type.TOP,page.Type.ABOUT,page.Type.MAKER,page.Type.MOVIE];
	this._classList = ["top","about","maker","movie"];
	var _g = this;
	this._controller = controller;
	var dom = window.document.getElementById("menu");
	var ul = framework.Elements.get(dom,"ul");
	this._balloon = ul[1];
	var a = framework.Elements.get(ul[0],"a");
	var _g1 = 0;
	var _g2 = a.length;
	while(_g1 < _g2) {
		var i = _g1++;
		this.setMouseOver(i,a[i]);
	}
	var closeBtn = window.document.getElementById("closeBtn");
	closeBtn.onclick = function(e) {
		_g._controller.changePage(page.Type.TOP);
		return false;
	};
	var foot = framework.Elements.get(window.document.getElementById("foot"),"h1")[0];
	this._footLogo = framework.Elements.get(foot,"a")[0];
	this._footLogo.onclick = function(e1) {
		return false;
	};
};
page.Menu.prototype = {
	setFootLogoClick: function() {
		var _g = this;
		this._footLogo.className = "toTop";
		this._footLogo.onclick = function(e) {
			_g._currentNum = 0;
			_g._controller.changePage(_g._pageList[0]);
			return false;
		};
	}
	,setMouseOver: function(n,elm) {
		var _g = this;
		elm.onmouseover = function(e) {
			if(_g._currentNum != n) _g._balloon.className = "balloon on_" + _g._classList[n];
		};
		elm.onmouseout = function(e1) {
			_g._balloon.className = "balloon";
		};
		elm.onclick = function(e2) {
			_g._currentNum = n;
			_g._controller.changePage(_g._pageList[n]);
			return false;
		};
	}
};
page.UserType = { __constructs__ : ["STANDARD","NO_ANIMATION","SIMPLE"] };
page.UserType.STANDARD = ["STANDARD",0];
page.UserType.STANDARD.__enum__ = page.UserType;
page.UserType.NO_ANIMATION = ["NO_ANIMATION",1];
page.UserType.NO_ANIMATION.__enum__ = page.UserType;
page.UserType.SIMPLE = ["SIMPLE",2];
page.UserType.SIMPLE.__enum__ = page.UserType;
page.Mode = function() { };
page.Mode.init = function() {
	var wrap = window.document.getElementById("wrap");
	if(framework.style.Prefix.animation == "" || framework.style.Prefix.transition == "") {
		page.Mode.type = page.UserType.NO_ANIMATION;
		wrap.className = "noAnimation";
	}
	if(framework.style.Prefix.transform == "") {
		page.Mode.type = page.UserType.SIMPLE;
		wrap.className = "simpleMode";
	}
};
page.Movie = function() {
	this._first = true;
	this._timer = null;
	this._contentDom = new parts.Container("movie");
	this._moviePlayer = new youtube.Player("mainMovie","Hq6NTPvGL-s",848,477);
};
page.Movie.prototype = {
	view: function() {
		var _g = this;
		this._moviePlayer.create();
		if(this._first) {
			this._contentDom.resetClass();
			this._first = false;
			this._timer = new haxe.Timer(500);
			this._timer.run = function() {
				_g._timer.stop();
				_g._contentDom.pushClass("view");
				_g._timer = new haxe.Timer(1200);
				_g._timer.run = function() {
					_g._timer.stop();
					_g._contentDom.pushClass("play");
					_g._timer = null;
				};
			};
		}
	}
	,'delete': function() {
		if(this._timer != null) {
			this._timer.stop();
			this._timer = null;
			this._first = true;
		}
		this._moviePlayer.clear();
	}
};
page.Top = function() {
	this._first = true;
	this._contentDom = new parts.Container("top");
	if(page.Mode.type != page.UserType.STANDARD) {
		this._first = false;
		this._contentDom.pushClass("push");
		this._contentDom.pushClass("view");
	}
};
page.Top.prototype = {
	view: function() {
		var _g = this;
		if(this._first) {
			this._contentDom.resetClass();
			this._first = false;
			this._timer = new haxe.Timer(500);
			this._timer.run = function() {
				_g._timer.stop();
				_g._timer = null;
				_g._timer = new haxe.Timer(10300);
				_g._timer.run = function() {
					_g._timer.stop();
					_g._contentDom.pushClass("push");
					_g._timer = null;
				};
				_g._contentDom.pushClass("view");
			};
		}
	}
	,'delete': function() {
		if(this._timer != null) {
			this._timer.stop();
			this._contentDom.resetClass();
			this._timer = null;
			this._first = true;
		}
	}
};
page.Type = { __constructs__ : ["LOAD","INTRO","TOP","ABOUT","MAKER","MOVIE"] };
page.Type.LOAD = ["LOAD",0];
page.Type.LOAD.__enum__ = page.Type;
page.Type.INTRO = ["INTRO",1];
page.Type.INTRO.__enum__ = page.Type;
page.Type.TOP = ["TOP",2];
page.Type.TOP.__enum__ = page.Type;
page.Type.ABOUT = ["ABOUT",3];
page.Type.ABOUT.__enum__ = page.Type;
page.Type.MAKER = ["MAKER",4];
page.Type.MAKER.__enum__ = page.Type;
page.Type.MOVIE = ["MOVIE",5];
page.Type.MOVIE.__enum__ = page.Type;
var parts = {};
parts.Container = function(id) {
	this.dom = window.document.getElementById(id);
	this._area = this.dom.parentElement;
	this.reloadClass();
	this.saveClass();
};
parts.Container.prototype = {
	'delete': function() {
		this._area.removeChild(this.dom);
	}
	,saveClass: function() {
		this._classDefault = this._classList.slice(0);
	}
	,reloadClass: function() {
		this._classList = this.dom.className.split(" ");
	}
	,chageClass: function(name) {
		this._classList = name.split(" ");
		this.dom.className = name;
	}
	,pushClass: function(name) {
		this._classList.push(name);
		this.dom.className = this._classList.join(" ");
	}
	,deleteClass: function(name) {
		HxOverrides.remove(this._classList,name);
		this.dom.className = this._classList.join(" ");
	}
	,resetClass: function() {
		this._classList = this._classDefault.slice(0);
		this.dom.className = this._classList.join(" ");
	}
};
parts.ModeType = { __constructs__ : ["DEFAULT","WALKING","RUNNING","RETURN","JUMP_RIGHT","JUMP_LEFT"] };
parts.ModeType.DEFAULT = ["DEFAULT",0];
parts.ModeType.DEFAULT.__enum__ = parts.ModeType;
parts.ModeType.WALKING = ["WALKING",1];
parts.ModeType.WALKING.__enum__ = parts.ModeType;
parts.ModeType.RUNNING = ["RUNNING",2];
parts.ModeType.RUNNING.__enum__ = parts.ModeType;
parts.ModeType.RETURN = ["RETURN",3];
parts.ModeType.RETURN.__enum__ = parts.ModeType;
parts.ModeType.JUMP_RIGHT = ["JUMP_RIGHT",4];
parts.ModeType.JUMP_RIGHT.__enum__ = parts.ModeType;
parts.ModeType.JUMP_LEFT = ["JUMP_LEFT",5];
parts.ModeType.JUMP_LEFT.__enum__ = parts.ModeType;
parts.Mario = function() { };
parts.Mario.init = function() {
	parts.Mario._dom = window.document.getElementById("mario");
	parts.Mario.setRange();
	framework.event.Window.addEvent(framework.event.EventType.RESIZE,parts.Mario.setRange);
};
parts.Mario.setRange = function() {
	var w = framework.user.Size.width();
	var r = Const.windowMinWidth;
	while(w > r) r += Const.cellSize * 2;
	parts.Mario._range = r * 0.5 + Const.cellSize;
	parts.Mario.changeMode(parts.Mario._mode,parts.Mario._endFunc);
};
parts.Mario.setX = function() {
	var matrix = "";
	if(document.defaultView != undefined) matrix = document.defaultView.getComputedStyle(parts.Mario._dom,null)[framework.style.Prefix.transform]; else matrix = parts.Mario._dom.currentStyle[framework.style.Prefix.transform];
	if(matrix != undefined) {
		parts.Mario._x = Std.parseInt(matrix.split(", ")[4]);
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSFORM,"translate(" + parts.Mario._x + "px,0)");
		parts.Mario._dom.className = parts.Mario.getClassName(parts.ModeType.DEFAULT);
		matrix = document.defaultView.getComputedStyle(parts.Mario._dom,null)[framework.style.Prefix.transform];
		parts.Mario._x = Std.parseInt(matrix.split(", ")[4]);
	}
};
parts.Mario.changeMode = function(mode,func) {
	parts.Mario._endFunc = func;
	if(mode != parts.ModeType.DEFAULT) parts.Mario._dom.style.display = "block";
	if(parts.Mario._timer != null) parts.Mario._timer.stop();
	parts.Mario._mode = mode;
	if(mode == parts.ModeType.RUNNING) parts.Mario.toRunning(true); else if(mode == parts.ModeType.WALKING) {
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSFORM,"translate(0,0)");
		parts.Mario._dom.className = parts.Mario.getClassName(parts.ModeType.WALKING);
		if(parts.Mario._endFunc != null) {
			parts.Mario._endFunc();
			parts.Mario._endFunc = null;
		}
	} else parts.Mario._dom.className = parts.Mario.getClassName(mode);
};
parts.Mario.toRunning = function(exit) {
	var duration;
	var endFunc = function() {
	};
	parts.Mario.setX();
	if(exit) {
		duration = parts.Mario.getAnimeDuration(parts.Mario._range - parts.Mario._x);
		parts.Mario._dom.className = parts.Mario.getClassName(parts.ModeType.RUNNING);
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSITION,duration + "s","Duration");
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSFORM,"translate(" + parts.Mario._range + "px,0)");
	} else {
		duration = parts.Mario.getAnimeDuration(parts.Mario._x);
		parts.Mario._dom.className = parts.Mario.getClassName(parts.ModeType.RETURN);
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSITION,duration + "s","Duration");
		framework.style.Prefix.setValue(parts.Mario._dom,framework.style.PropertyList.TRANSFORM,"translate(0,0)");
	}
	parts.Mario._timer = new haxe.Timer(Math.floor(duration * 1000));
	parts.Mario._timer.run = function() {
		parts.Mario._timer.stop();
		parts.Mario._timer = null;
		parts.Mario._mode = parts.ModeType.DEFAULT;
		parts.Mario._dom.className = parts.Mario.getClassName(parts.Mario._mode);
		parts.Mario.hidden();
		if(parts.Mario._endFunc != null) {
			parts.Mario._endFunc();
			parts.Mario._endFunc = null;
		}
	};
};
parts.Mario.hidden = function() {
	parts.Mario._dom.style.display = "none";
};
parts.Mario.getClassName = function(mode) {
	switch(mode[1]) {
	case 0:
		return "";
	case 1:
		return "walk";
	case 2:
		return "run";
	case 3:
		return "return";
	case 4:
		return "jump_right";
	case 5:
		return "jump_left";
	}
};
parts.Mario.getAnimeDuration = function(vx) {
	if(vx < 0) vx *= -1;
	return vx / Const.cellSize * 0.125;
};
parts.Slide = function() {
	this._timer = null;
	this._show = false;
	this._pageMax = 4;
	this._pageNum = 0;
	var _g = this;
	this._content = framework.Elements.get(window.document.getElementById("make_slide"),"ul")[0];
	this._prevBtn = window.document.getElementById("make_slide_prev");
	this._nextBtn = window.document.getElementById("make_slide_next");
	this._moviePlayer = new youtube.Player("makeMovie","qfOXHyF34OU",700,394,true,0,function() {
		if(_g._show && _g._pageNum == 0) _g._moviePlayer.play();
	},function() {
		_g._moviePlayer.play();
	});
	this._prevBtn.onclick = $bind(this,this.prevPage);
	this._nextBtn.onclick = $bind(this,this.nextPage);
};
parts.Slide.prototype = {
	nextPage: function(e) {
		this._pageNum++;
		this._content.style.left = -100 * this._pageNum + "%";
		this._prevBtn.className = "";
		this._moviePlayer.pause();
		if(this._pageNum == this._pageMax - 1) this._nextBtn.className = "none";
		return false;
	}
	,prevPage: function(e) {
		this._pageNum--;
		this._content.style.left = -100 * this._pageNum + "%";
		this._nextBtn.className = "";
		if(this._pageNum == 0) {
			this._moviePlayer.play();
			this._prevBtn.className = "none";
		}
		return false;
	}
	,movieStop: function() {
		this._show = false;
		this._moviePlayer.clear();
	}
	,restart: function() {
		this._show = true;
		this._moviePlayer.create();
	}
};
var youtube = {};
youtube.IframeAPI = function() { };
youtube.IframeAPI.load = function(cb) {
	if(youtube.IframeAPI.ready) {
		window.setTimeout(cb,1);
		return;
	}
	if(youtube.IframeAPI.iframeAPICallbacks == null) youtube.IframeAPI.iframeAPICallbacks = [];
	youtube.IframeAPI.iframeAPICallbacks.push(cb);
	if(!youtube.IframeAPI.injected) {
		var doc = window.document;
		var script = doc.createElement("script");
		script.src = "https://www.youtube.com/iframe_api";
		var firstScript = doc.getElementsByTagName("script")[0];
		firstScript.parentNode.insertBefore(script,firstScript);
		window.onYouTubeIframeAPIReady = youtube.IframeAPI.onYouTubeIframeAPIReady;
		youtube.IframeAPI.injected = true;
	}
};
youtube.IframeAPI.onYouTubeIframeAPIReady = function() {
	youtube.IframeAPI.ready = true;
	if(youtube.IframeAPI.iframeAPICallbacks == null) return;
	var _g = 0;
	var _g1 = youtube.IframeAPI.iframeAPICallbacks;
	while(_g < _g1.length) {
		var cb = _g1[_g];
		++_g;
		cb();
	}
};
youtube.Player = function(id,video,width,height,mute,controller,loadedFunc,endFunc) {
	if(controller == null) controller = 1;
	if(mute == null) mute = false;
	this._mute = false;
	this.loaded = false;
	this._mute = mute;
	this._loadedFunc = loadedFunc;
	this._endFunc = endFunc;
	this._id = id;
	this._option = { videoId : video, width : width, height : height, playerVars : { rel : 0, showinfo : 0, controls : controller, wmode : "transparent"}, events : { onReady : $bind(this,this.playerOnReady), onStateChange : $bind(this,this.playerStateChange)}};
};
youtube.Player.prototype = {
	create: function() {
		var _g = this;
		youtube.IframeAPI.load(function() {
			_g._player = new YT.Player(_g._id,_g._option);
			_g._playerElm = _g._player.getIframe();
		});
	}
	,playerStateChange: function(event) {
		if(event.data == YT.PlayerState.ENDED) {
			if(this._endFunc != null) this._endFunc();
		}
	}
	,playerOnReady: function(event) {
		if(this._mute) this._player.mute(); else this._player.unMute();
		if(this._loadedFunc != null) {
			this.loaded = true;
			this._loadedFunc();
		}
	}
	,stop: function() {
		if(this.loaded) this._player.stopVideo();
	}
	,reset: function() {
		if(this.loaded) this._player.seekTo(0,true);
	}
	,play: function() {
		if(this.loaded) this._player.playVideo();
	}
	,pause: function() {
		if(this.loaded) this._player.pauseVideo();
	}
	,clear: function() {
		if(this.loaded) this._player.stopVideo();
		var newDom = window.document.createElement("div");
		newDom.id = this._id;
		this._playerElm.parentElement.replaceChild(newDom,this._playerElm);
		this._player = null;
		this._playerElm = null;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
Const.windowMinWidth = 960;
Const.cellSize = 32;
framework.event.Window._loadFunc = new framework.FunctionList();
framework.event.Window._scrollFunc = new framework.FunctionList();
framework.event.Window._resizeFunc = new framework.FunctionList();
framework.event.Window._blurFunc = new framework.FunctionList();
framework.event.Window._focusFunc = new framework.FunctionList();
framework.event.Window._option = { scroll : false, resize : false, blur : false, focus : false};
framework.style.Prefix.transform = "transform";
framework.style.Prefix.transition = "transition";
framework.style.Prefix.animation = "animation";
framework.style.Prefix._pre = ["Webkit","Moz","O","ms"];
framework.style.Prefix._preCSS = ["-webkit-","-moz-","-o-","-ms-"];
framework.user.Size._wd = window;
framework.user.Size._dc = window.document;
framework.user.Size._bd = window.document.body;
framework.user.Size._keys = ["width","height","clientWidth","clientHeight","top","left"];
framework.user.Size._values = new framework.Flag(framework.user.Size._keys);
framework.user.UserAgent.ua = window.navigator.userAgent;
framework.user.UserAgent.os = new framework.user.OS();
framework.user.UserAgent.device = new framework.user.Device();
framework.user.UserAgent.browser = new framework.user.Browser();
page.Mode.type = page.UserType.STANDARD;
parts.Mario._x = Const.cellSize * -8;
parts.Mario._y = 0;
parts.Mario._mode = parts.ModeType.DEFAULT;
youtube.IframeAPI.ready = false;
youtube.IframeAPI.injected = false;
youtube.IframeAPI.SCRIPT_URL = "https://www.youtube.com/iframe_api";
Main.main();
})();
