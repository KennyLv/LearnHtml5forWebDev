/**
* @ author feng_wei
* @ memo 工具类模块
* @ version 1.0.0
*/
define(function(require, exports, module) {
	var $ = require('../lib/zepto/zepto');
	
	var conf = require('../ipconfig');
	
	module.exports={
		
		doNet : function(data, success, error,target) {
			
			var url = this.getItem("ctx")+"/wsi/wechat.shtml?action=wsiService&itf=maneuver&ZTXXID="+this.getItem("ztxxid");
			
			//url = "http://webapp.hoperun.com:8888/frm/wsi/wechat.shtml?action=wsiService&itf=maneuver&ZTXXID=645412_r";
			//url = "http://10.20.134.11:8070/frm/wsi/wechat.shtml?action=wsiService&itf=maneuver&ZTXXID=645412_r";
			//url = "http://10.20.134.158:8080/frm/wsi/wechat.shtml?action=wsiService&itf=maneuver&ZTXXID=645412_r";


			$.ajax({url:url, type:"POST", dataType:"text", data:{"jsonData":data}, complete:function (xhr) {
				
				eval("jsonResult = " + xhr.responseText);
				
				if (jsonResult.success === true) {
					if (jsonResult.data == "" || jsonResult.data == null || jsonResult.data == "undefined") {
							// alert(data+"没有数据");
					}
					eval(success(jsonResult.data,target));
				} else {
					$("#loading").hide();
					if(typeof error=="function"){
						error(jsonResult.messages,target);
					}
					
				}
			}});
		},
		/**
		 * 将未定义或数值为空的数据输出""
		 * 
		 * @ param value要处理的数据
		 */
		getNull : function(value) {
			value = value + "";
			if (value == undefined || value == "undefined" || value == null || value == "null") {
				return "&nbsp;";
			} else {
				value = value.toString();
				return value;
			}
		},

		getQueryString : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
		
		setItem : function(key,value){
			if(conf.appid){
				window.localStorage.setItem(conf.appid+"_"+key,value);
			}else{
				window.localStorage.setItem(key,value);
			}
		},
		
		getItem : function(key){
			if(conf.appid){
				return window.localStorage.getItem(conf.appid+"_"+key);
			}else{
				return window.localStorage.getItem(key);
			}
		},
		
		removeItem : function(key){
			if(conf.appid){
				window.localStorage.removeItem(conf.appid+"_"+key);
			}else{
				window.localStorage.removeItem(key);
			}
		},
		
		clearStorage : function(){
			window.localStorage.clear();
			if(1!=1){
				for(var i=0;i<window.localStorage.length;i++){
					window.localStorage.removeItem(window.localStorage.key(i));
				}
			}
		},
		
		showmsg : function (msg, error) {
			if (error) {
				$('.u-note-error').html(msg);
				$(".u-note-error").addClass("on");
				$(".u-note-sucess").removeClass("on");

				setTimeout(function(){
					$(".u-note").removeClass("on");
				},2000);
			} else {
				$('.u-note-sucess').html(msg);
				$(".u-note-sucess").addClass("on");
				$(".u-note-error").removeClass("on");

				setTimeout(function(){
					$(".u-note").removeClass("on");
				},2000);
			}
		},
		
		// loading显示
		loadingPageShow : function(){
			$('.u-pageLoading').show();
		},
		
		// loading隐藏
		loadingPageHide : function (){
			$('.u-pageLoading').hide();	
		},
		
		isStringEmpty : function(str){
			if (str == undefined || str == "undefined" || str == null || str == "null" || str == "") {
					return true;
			}
			return false;
		},
		
		isIntEquals : function(target,source){
			try{source=parseInt(source)}catch(e){return false}
			return target==source+''||target==parseInt(source);
		},
		
		parseInt : function(value){
			
			try{
				return parseInt(value);	
			}catch(e){
				return 	value;
			}	
			
		
		}
		
		
	
	}
});