/**
* @ author feng_wei
* @ memo 工具类模块
* @ version 1.0.0
*/
define(function(require, exports, module) {
	var $ = require('../lib/zepto/zepto');
	var conf = require('../ipconfig');
	//var baseip= conf.shareIP;
	var defaultsUri = {
			getCardPairInfoRequest:{
					"requestUri" : "%ctx%/wsi/wechat.shtml?action=wsiService&itf=cardpair&ztxxid=%ztxxid%",
					"requestMethod" : "POST"
			},
			postShareRequest : {
					"requestUri" : "%ctx%/wsi/wechat.shtml?action=wsiService&itf=cardpair&ztxxid=%ztxxid%",
					"requestMethod" : "POST"
			}
	};

  var _sendHttpRequest = function(args){
			console.log(args.url);
			var requestData = JSON.stringify(args.data);
			$.ajax({
					url : args.url,
					type : "POST",
					dataType: 'text',
					data: {"jsonData":requestData},
					success : function(resp){
							console.log("Receive Message : \r\n" + resp);
							args.success(resp);
					},
					error: function(jqXHR){
							// log("Error Message : " + JSON.stringify(jqXHR));
							args.error(jqXHR);
					}
			});
	};
	
	module.exports={
		getCardInfo : function(_data, success, error,target) {
		
			//var url = this.getItem("ctx") + "/wsi/wechat.shtml?action=wsiService&itf=giftbox&ztxxid="+this.getItem("ztxxid");
			
			var cardPairInfoRequest = $.extend(defaultsUri.getCardPairInfoRequest);
			cardPairInfoRequest.requestUri = cardPairInfoRequest.requestUri.replace("%ctx%", this.getItem("ctx") );
			cardPairInfoRequest.requestUri = cardPairInfoRequest.requestUri.replace("%ztxxid%", this.getItem("ztxxid"));

			
			$.ajax({url:cardPairInfoRequest.requestUri, type:"POST", dataType:"text", data:{"jsonData":JSON.stringify(_data)}, complete:function (xhr) {
				
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
			
			/*
			
			_sendHttpRequest({
					url : cardPairInfoRequest.requestUri,
					data : _data,
					type : cardPairInfoRequest.requestMethod,
					success : _successFn,
					error : _errorFn
			});
			*/
			
			
			
		},
		
		shareMyResult : function(_data, _successFn, _errorFn) {
			//var baseip= conf.shareIP;
			//var url = baseip + "/wsi/wechat.shtml?action=wsiService&itf=maneuver&ZTXXID=";
			
			var shareRequest = $.extend(defaultsUri.postShareRequest);
			shareRequest.requestUri = shareRequest.requestUri.replace("%ctx%", this.getItem("ctx") );
			shareRequest.requestUri = shareRequest.requestUri.replace("%ztxxid%", this.getItem("ztxxid"));
			
			_sendHttpRequest({
					url : shareRequest.requestUri,
					data : _data,
					type : shareRequest.requestMethod,
					success : _successFn,
					error : _errorFn
			});
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
			
		
		},
		
		/**
		 * 统计函数初始化
		 */
		 statisticsInit : function(data,type) {
			try{
				// 当前用户
				var user=this.getQueryString("user");
				this.setItem("user", user);
				// 分享用户
				var suser=this.getQueryString("suser");
				this.setItem("suser", suser);
				// 数据标识
				var ztxxid = this.getQueryString("ztxxid");
				this.setItem("ztxxid", ztxxid);
				// 接口配置
				var ctx = this.getQueryString("ctx");
				this.setItem("ctx", ctx);
				// 营销业务参数
				var cid = this.getQueryString("cid");
				this.setItem("cid", cid);
				// 营销业务参数
				var mid = this.getQueryString("mid");
				this.setItem("mid", cid);
						
				var appId = this.getQueryString("id");
				if(appId==null||appId=='null'){
					appId = this.getItem("appId");
				}
				
				this.setItem("appId", appId);

				var shareUrl="http://"+conf.shareIP+"/frm/wsi/redirect.shtml?action=doRedirect&id="+conf.AppSecret+"&t="+type+"&u=";
				
				shareUrl+="id@"+appId;
				
				shareUrl+=";cid@"+cid;
				
				// 如果当前访问用户不是营销专员,则不对营销专员标识做替换
				if(data.mid==undefined||data.mid==''){
					shareUrl+=";mid@"+mid;
				}else{
					shareUrl+=";mid@"+data.mid;
				}
				
				// 如果当前访问用户为空,则来源用户仍然使用原分享用户
				if(user==undefined||user==''){
					shareUrl+=";suser@"+suser;
				}else{
					shareUrl+=";suser@"+user;
				}

				$('#r-wx-link').val(shareUrl);
				
				this.setItem("shareUrl",shareUrl);
				
				// 调用统计函数
				this.statistics(appId,cid,mid,user,suser);
				
				this.packShareUrl();
				
			}catch(e){
			
			}
		},
		
		/**
		* 封装分享URL
		**/
		packShareUrl : function(addUrl){
			var staUrl=this.getItem("ctx")+"/wsi/wechat.shtml?action=wsiService&itf=statistics&ztxxid="+this.getItem("ztxxid");
			
			var shareUrl=this.getItem("shareUrl");
			
			if(RegExp("MicroMessenger").test(navigator.userAgent)? true : false){ 
				$(document.body).wx({});
			}
			try{
				for(var p in addUrl){  
					if(typeof(addUrl[p])=="function"){  
						continue;  
					}else{  
						shareUrl += ";"+ p + "@" + addUrl[p];  
					}  
				}
				this.setItem("shareUrl",shareUrl);
			}catch(e){
			
			}
			$('#r-wx-link').val(shareUrl);
			
			var data="{option:3,url:'"+shareUrl+"'}"
			$.ajax({url:staUrl, 
					type:"POST", 
					dataType:"text", 
					data:{"jsonData":data}, 
					complete:function (xhr) {
							eval("jsonResult = " + xhr.responseText);
							$('#r-wx-link').val(jsonResult.data.shortUrl);
							if(RegExp("MicroMessenger").test(navigator.userAgent)? true : false){ 
								$(document.body).wx({});
							}
						}
					});
		},

		/**
		* 更新分享次数
		**/
		updateShareCount : function(){
			var staUrl=this.getItem("ctx")+"/wsi/wechat.shtml?action=wsiService&itf=statistics&ztxxid="+this.getItem("ztxxid");
			var data="{option:2,code:'"+this.getItem("statisticsunique")+"'}"
			$.ajax({url:staUrl, 
					type:"POST", 
					dataType:"text", 
					data:{"jsonData":data}, 
					complete:function (xhr) {
						}
					});
		},

		/**
		* 访问统计
		*/
		statistics : function(activityId,cid,mid,cuser,suser){
			var staUrl=this.getItem("ctx")+"/wsi/wechat.shtml?action=wsiService&itf=statistics&ztxxid="+this.getItem("ztxxid");
			var date=new Date();
			var uniqueFlag=''+date.getFullYear();
			uniqueFlag+=date.getMonth()<9?'0'+(date.getMonth()+1):(date.getMonth()+1);
			uniqueFlag+=''+date.getDate();
			uniqueFlag+=''+date.getHours();
			uniqueFlag+=''+date.getMinutes();
			uniqueFlag+=''+date.getSeconds();
			uniqueFlag+=''+date.getMilliseconds();
			uniqueFlag+=((Math.floor(Math.random()*10000)+10000)+'').substr(1,4);
			this.setItem("statisticsunique",uniqueFlag);
			var data="{option:1,activityId:'"+activityId+"'";
			data+=",code:'"+uniqueFlag+"'";
			data+=",cid:'"+cid+"'";
			data+=",mid:'"+mid+"'";
			data+=",user:'"+cuser+"'";
			data+=",suser:'"+suser+"'}";
			$.ajax({url:staUrl, 
					type:"POST", 
					dataType:"text", 
					data:{"jsonData":data}, 
					complete:function (xhr) {}
					});

		}
		
		
	
	}
});