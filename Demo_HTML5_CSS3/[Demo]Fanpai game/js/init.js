define(function(require, exports, module) {
	var $ = require('./lib/zepto/zepto'), $=require('./lib/zepto/animationShow');
	var utils = require('./utils/utils');
	var game = require('./game');
	
	$(function(){
		
		
		
		init();
		
		var data = {
				"option" : 1,
				"id" : utils.getItem("activityId"),
				"UserId" : utils.getItem("myUserId")
		};
		
			
		
		//utils.doNet(data, pageInit);
	
			pagePack({});
	
	});
	
	/**
	 * 参数初始化
	 */
	function init() {
		/*
		var myUserId = utils.getQueryString("user");
		var ztxxid = utils.getQueryString("ztxxid");
		var ctx = utils.getQueryString("ctx");
		var activityId = utils.getQueryString("activityId");
		if(activityId==null||activityId=='null'){
				activityId = utils.getItem("activityId");
		}
		
		utils.setItem("resumeUrl",window.location.href);
		utils.setItem("activityId", activityId);
		utils.setItem("myUserId", myUserId);
		utils.setItem("ztxxid", ztxxid);
		utils.setItem("ctx", ctx);
		*/
	}
	
	function pageInit(data){
		// 设置标题栏
		/*
		var gameView = game.init();
		$(".m-game").html(gameView).css("display","block");
		
		
		if(data.ManName){
			document.title = data.ManName;
			utils.setItem("ducTit",data.ManName);
		}else{
			document.title = "代码模板";
		}
		
		pagePack(data);
		*/

	}
	
	
	function pagePack(data){
			showScreen("loading");
			var gameCanvas = $('#gameCanvas');
			var images = [
					{ "id" : "0", "src" : "img/1.jpg"},
					{ "id" : "1", "src" : "img/2.jpg"},
					{ "id" : "2", "src" : "img/3.jpg"},
					{ "id" : "3", "src" : "img/4.jpg"},
					{ "id" : "4", "src" : "img/5.jpg"},
					{ "id" : "5", "src" : "img/6.jpg"}
			]
		
			game.setUp(gameCanvas, images);
			
			/*function(){
				$("#startup_startBtn").on("click",function(){
						showScreen("game");
						game.start();
				});
				showScreen("startup");
			});
			*/
			
			game.start(gameStatusChangedCallback);
			
	}
	
	function gameStatusChangedCallback(_data){
			switch (_data.status){
					case "STARTED":
							console.log("started");
					break;
					case "STOPPED":
							console.log("stopped");
					break;
					case "FINISHED":
							alert("You finshed in  " + (60 - _data.remainTime) + "s, share or retry?");
					break;
					case "FAILED":
							alert("You have get " + _data.score + ", retry?");
					break;
			}
	}
	
	function showScreen(screenClass){
			$(".m-"+ screenClass).css("display","block");
			$(".page").css("display","none");
	}
	
	
	window._isDisableFlipPage = false;
	window.pageScroll = {
		disable : function () {
			window._isDisableFlipPage = true;
		},
		enable : function () {
			window._isDisableFlipPage = false;
		}
	};
	
/*****************************************************************************************/
});