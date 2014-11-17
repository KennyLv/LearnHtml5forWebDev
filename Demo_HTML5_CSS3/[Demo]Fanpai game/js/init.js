define(function(require, exports, module) {
	var $ = require('./lib/zepto/zepto'), $=require('./lib/zepto/animationShow'), $=require('./lib/zepto/touch');
	var utils = require('./utils/utils');
	var game = require('./game');
	
	$(function(){
	
		init();
		
		var requestData = {
				"option" : 1,
				"id" : utils.getItem("activityId"),
				"UserId" : utils.getItem("myUserId")
		};
		
		//utils.doNet(requestData, pageInit);
		
		setTimeout(pageInit({}),100);
		
	});
	
	/**
	 * 参数初始化
	 */
	function init() {
				//TODO : 重构地址解析/本地缓存
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
		*/
		
		
			var images = [
					{ "id" : "0", "src" : "img/1.jpg"},
					{ "id" : "1", "src" : "img/2.jpg"},
					{ "id" : "2", "src" : "img/3.jpg"},
					{ "id" : "3", "src" : "img/4.jpg"},
					{ "id" : "4", "src" : "img/5.jpg"},
					{ "id" : "5", "src" : "img/6.jpg"}
			];
			var cardBgImg = "./img/back.png";
			var themeImg = "./img/start.jpg";
			var startBtnImg = "./img/btnStart.png";
			var resultBgImg = "./img/end.png";
			var retryBtnImg = "./img/btnRetry.png";
			var shareBtnImg = "./img/btnShare.png";
			var guideImg = "./img/guide.png";
			
			$("#startUpPage").css("background", "#56b8ff url(" + themeImg + ") center bottom no-repeat;");
			$("#startup_startBtn").css("background", "url(" + startBtnImg + ") no-repeat");
			$("#loading_reday").attr("src", "" + "./img/ready.png" + "");
			$("#loading_go").attr("src", "" +  "./img/go.png"  + "");
			$("#game_over").attr("src", "" +  "./img/gameover.png"  + "");
			$("#resultPage").css("background", "url(" + resultBgImg + ") 20px 100px no-repeat");
			$("#retry").css("background", "url(" + retryBtnImg + ") no-repeat");
			$("#share").css("background", "url(" + shareBtnImg + ") no-repeat");
			$("#shareguideImg").attr("src", "" + guideImg + "");
			
			showScreen("startup");//
			
			$("#startup_startBtn").on('click',function(e){
			//$("#startup_startBtn").on('touchend',function(e){
					e.preventDefault(); // 阻止"默认冒泡行为"
					startNewGame( images, cardBgImg, gameStatusChangedCallback );
					//TODO ： playMusic();
					showScreen("loading");
					
					$("#loading_reday").animate("popin", 1000, "ease-out", function(){
							$("#loading_reday").css("display", "none");
							$("#loading_go").css("display", "block");
							$("#loading_go").animate("popin", 1000, function(){
									$("#loading_go").css("display", "none");
									showScreen("game");
									game.start();
							});
					});
					
			});
			
			$("#retry").on('click',function(e){
			//$("#retry").on('touchend',function(e){
					e.preventDefault();
					startNewGame( images, cardBgImg, gameStatusChangedCallback );
					$("#gameCanvasCover").css("display", "none");
					$("#resultPage").css("display", "none");
					//showScreen("game");
					game.start();
			});
		
			$("#share").on('click',function(e){
			//$("#share").on('touchend',function(e){
					e.preventDefault();
					showScreen("result");
					$("#pageshareguide").css("display", "block");
			});
			
			$("#pageshareguide").on('click',function(e){
			//$("#pageshareguide").on('touchend',function(e){
					e.preventDefault(); // 阻止"默认冒泡行为"
					//$("#pageshareguide").css("display", "none");
					/*
					startNewGame( images, cardBgImg, gameStatusChangedCallback );
					showScreen("game");
					game.start();
					*/
			});
			
		
	}
	
	function startNewGame(sourceImgs, backImgs, statusChangedCallback ){
					var gameCanvas = $('#gameCanvas');
					game.setUp(gameCanvas, sourceImgs, backImgs, {"totalCardsNum":20, "timeLimit":1},statusChangedCallback);
	}
	
	function playMusic(){
	
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
									showScreen("result");
									$("#msg").html("你在" + (60 - _data.remainTime) + "秒内完成游戏并获得" + _data.score + "分。");
					break;
					case "FAILED":
							$("#gameCanvasCover").css("display", "block");
							$("#resultPage").css("display", "block");
							$("#msg_current_score").html("当前得分 ：" + _data.score);
							$("#msg_history_score").html("历史最高 ：" + _data.score);
							/*
							$("#game_over").animate("popinscan", 1500, "ease-out", function(){
									$("#game_over").css("display", "none");
									$("#gameCanvasCover").css("display", "none");
									showScreen("result");
									$("#msg").html("You have get " + _data.score + ", retry?");
							});
							*/
					break;
			}
	}
	
	function showScreen(screenClass){
			$(".page").css("display","none");
			$(".m-"+ screenClass).css("display","block");
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