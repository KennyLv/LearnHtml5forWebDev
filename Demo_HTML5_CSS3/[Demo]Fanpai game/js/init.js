define(function(require, exports, module) {
	// 加载Zepto核心组件和选择器组件
	var $ = require('./lib/zepto/zepto'), 
	$=require('./lib/zepto/animationShow'), 
	$=require('./lib/zepto/touch'),
	$=require('./plugins/wechat/wechat');
	
	var utils = require('./utils/utils');
	// 加载配置文件
	var conf = require('./ipconfig');
	var game = require('./game');
	
	$(function(){
		init();
		
		var requestData = {
				"option" : 1,
				"id" : utils.getItem("appId"),
				"User" : utils.getItem("user")
		};
		
		utils.getCardInfo(requestData, onPageInit, onLoadError,null);
		/*
		setTimeout(onPageInit({
				CashCode: "abc123",
				CashMemo: "进入游戏-点击兑换",
				CashRule: "0",
				//EncourageBackImage: "/server/type/2014/11-19/aa666265-39d8-41e2-877b-1c996b16f4cc.jpg",
				EncourageLink: "http:m.dianping.com",
				InitBackImage: "",
				State: "1",
				id: "B99C1363-7D51-49DE-BCAF-CAF13EEE3152",
				
				CardImage : ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/6.jpg"]
		}),100);
		*/
	});
	
	/**
	 * 参数初始化
	 */
	function init() {
				// 活动主键
		var appId = utils.getQueryString("id");
		if(appId==null||appId=='null'){
			appId = utils.getItem("appId");
		}
		utils.setItem("appId", appId);
		// 数据标识
		var ztxxid = utils.getQueryString("ztxxid");
		utils.setItem("ztxxid", ztxxid);
		// 接口配置
		var ctx = utils.getQueryString("ctx");
		utils.setItem("ctx", ctx);
		// 当前用户
		var user=utils.getQueryString("user");
		utils.setItem("user", user);
		
		
	}
	
	function onPageInit(data){
		// 设置标题栏
		if(data.ManName){
			document.title = data.ManName;
			utils.setItem("ducTit",data.ManName);
		}else{
			document.title = "记忆翻牌";
		}
				
		pagePack(data);
		
		wxShareInit(data);
		
		statisticsInit(data);
		
	}
	
	/**
	* 场景组装
	*/
	function pagePack(data){
		
		var images = [];
		for(var i=0; i<data.CardImage.length; i++){
				var img = {
						 "id" : i,
						 "src" :data.CardImage[i]
				}
				images.push(img);
		}
			
			var themeImg =   (data.InitBackImage == "")? "./img/start.jpg" : data.InitBackImage;
			var cardBgImg = (data.CardBackImage)? data.CardBackImage : "./img/back.png";
			var resultBgImg = (data.OverBackImage)? data.OverBackImage : "./img/end.png";
			var encourageBackImage = (data.EncourageBackImage)? data.EncourageBackImage : "./img/encourageBack.png";
			
			var startBtnImg = "./img/btnStart.png";
			var retryBtnImg = "./img/btnRetry.png";
			var shareBtnImg = "./img/btnShare.png";
			var guideImg = "./img/guide.png";
			
			//$("#startUpPage").css("background", "#ffffff url(" + themeImg + ") center bottom no-repeat;");
			$("#startUpPage_back_img").attr("src", "" + themeImg + "");
			$("#startup_startBtn").css("background", "url(" + startBtnImg + ") no-repeat");
			$("#loading_reday").attr("src", "" + "./img/ready.png" + "");
			$("#loading_go").attr("src", "" +  "./img/go.png"  + "");
			
			//$("#resultPage").css("background", "url(" + resultBgImg + ") 20px 100px no-repeat");
			$("#game_over_back_img").attr("src", "" + resultBgImg + "");
			$("#game_over").attr("src", "" +  "./img/gameover.png"  + "");
			$("#retry").css("background", "url(" + retryBtnImg + ") no-repeat");
			$("#share").css("background", "url(" + shareBtnImg + ") no-repeat");
			
			$("#shareguideImg").attr("src", "" + guideImg + "");
			
			//$("#pinCodePage").css("background", "url(" + encourageBackImage + ") left top repeat-y;");
			$("#pincode_back_img").attr("src", "" + encourageBackImage + "");
			$("#msg_pincode").text(data.CashCode);
			$("#msg_pincode_memo").text(data.CashMemo);
			$("#moregmae").attr("href",data.EncourageLink);
			
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
					showScreen("game");
					/*
					//For share callback test 
					showScreen("game");
					$("#resultPage").css("display", "none");
					$("#pinCodePage").css("display", "block");
					*/
			});
			
		
	}
	
	function onLoadError(error){
			console.log(error);
	}
	
	function startNewGame(sourceImgs, backImgs, statusChangedCallback ){
					var gameCanvas = $('#gameCanvas');
					game.setUp(gameCanvas, sourceImgs, backImgs, {"totalCardsNum":20, "timeLimit":30},statusChangedCallback);
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
									/*showScreen("result");
									$("#msg").html("你在" + (60 - _data.remainTime) + "秒内完成游戏并获得" + _data.score + "分。");*/
							$("#gameCanvasCover").css("display", "block");
							$("#resultPage").css("display", "block");
							$("#msg_current_score").html("当前得分 ：" + _data.score);
							$("#msg_history_score").html("历史最高 ：" + _data.highestScore);
					break;
					case "FAILED":
							$("#gameCanvasCover").css("display", "block");
							$("#resultPage").css("display", "block");
							$("#msg_current_score").html("当前得分 ：" + _data.score);
							$("#msg_history_score").html("历史最高 ：" + _data.highestScore);
					break;
			}
	}
	
	function showScreen(screenClass){
			$(".page").css("display","none");
			$(".m-"+ screenClass).css("display","block");
	}
	
		
  function wxShareInit(data){
		if($('#r-wx-title').length==0){
			$("body").append("<input type='hidden' id='r-wx-title'>");
		}
		if($('#r-wx-img').length==0){
			$("body").append("<input type='hidden' id='r-wx-img'>");
		}
		if($('#r-wx-con').length==0){
			$("body").append("<input type='hidden' id='r-wx-con'>");
		}
		if($('#r-wx-link').length==0){
			$("body").append("<input type='hidden' id='r-wx-link'>");
		}
		
		$('#r-wx-title').val(data.ShareTitle);
		$('#r-wx-img').val(data.ShareIcon);
		$('#r-wx-con').val(data.ShareContent);
		
		// 定义分享后的跳转处理逻辑
		window.shareGoto = function(){
				showScreen("game");
				$("#resultPage").css("display", "none");
				$("#pinCodePage").css("display", "block");
		};
	}
	/**
	 * 参数初始化
	 */
	function statisticsInit(data) {
		utils.statisticsInit(data);
	}
	
	/**
	* 增加分享参数示例
	*/
	function addSrcUrlParam(){
		
		utils.packShareUrl({SrcRecord:"123455678",UserRecord:"87654321"});
	
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