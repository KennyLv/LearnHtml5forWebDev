define(function(require, exports, module) {

	var cardcss = require('../css/card.css');
	var animate = require('../css/animate.css');
	
	var gameInfo = {
			canvas:null,
			shuffleTimes : 8,
			selectedCards : [],
			timerInterval : null,
			cardsNum : 16,
			cardImgs : []
	};
	
	var gameStaus = {
			score : 0,
			remainTime : 60,
			status : "STOPPED", // "STARTED" "FINISHED" "FAILED"
			statusChangedNotification : null
	}
	
	var _updateStatus = function(_status){
			gameStaus.status= _status;
			if(gameStaus.statusChangedNotification != null){
					gameStaus.statusChangedNotification(gameStaus);
			}
	}
	
	var _shuffleCard = function(_cardImgs, _cardsNum, _shuffleTimes){
			//随机选择图片生产卡牌总数一半的牌
			var chooseParis = [];
			var imgNum = _cardImgs.length;
			var half= Math.floor(_cardsNum/2);
			for(var j=0; j<half; j++){
			var	r = Math.floor(Math.random() * imgNum);
					chooseParis.push(_cardImgs[r]);
			}
			//所有牌乘二
			var newArray = chooseParis.concat(chooseParis);
			//洗牌算法，任意多次轮洗
			for(var idx=0; idx<_shuffleTimes; idx++) {
					var	i = Math.floor(Math.random() * _shuffleTimes);
					var  j = Math.floor(Math.random() * _shuffleTimes);
					var temp = newArray[i];
					newArray[i] = newArray[j];
					newArray[j] = temp;
			}
			return newArray;
	}
	
	var _cardCreator = function(_cardId, _cardName, _cardImg){
			var cardHtml =	'<div class="demo">'
						+'<div class="box viewport-flip" cardId=card_' + _cardId + '  isopened="false" cardName="'+ _cardName +'" >'
						+'<a href="" class="list flip out"><img src="' + _cardImg + '" alt="纸牌正面"></a>'
						+'<a href="" class="list flip in"><img src="./img/puke-back.png" alt="纸牌背面"></a>'
						+'</div>'
						+'</div>';
			return cardHtml;
	}
	
	var _render = function(_cardArr, cardCanvas){
	
			for(var index=0; index <_cardArr.length; index++){
					cardCanvas.append(_cardCreator(index, _cardArr[index].id, _cardArr[index].src));
			}
			//http://devilswrwr.blog.163.com/blog/static/6583867020132432528577/
			//http://www.xiaoboy.com/detail/1341545073.html
			//http://www.tuicool.com/articles/VniQRr
			$(".box").bind("click", function() {
			//$(".box").on("tap", function() {
					var currentCard = $(this);
					if(currentCard.attr('isopened') == 'false' && gameInfo.selectedCards.length <2){
					
							currentCard.attr('isopened','true');
							_flipCard(currentCard);
							gameInfo.selectedCards.push(currentCard);
							if(gameInfo.selectedCards.length >1){
									setTimeout(function() {
											_checkCard();
									},400);
							}
					}
					return false;
			});
	}
	
	var _checkCard = function(){
			if(gameInfo.selectedCards.length >1){
					//console.log("opened " + gameInfo.selectedCards.length);
					if(_isTheSamePic()){
							for(var i = 0; i < gameInfo.selectedCards.length; i++){
									gameInfo.selectedCards[i].parent().empty();
							}
							gameStaus.score += 1;
							$("#score").html(gameStaus.score);
							if($(".box").length <1){
									_updateStatus("FINISHED");
							}
							
					}else{
							for(var i = 0; i < gameInfo.selectedCards.length; i++){
									if(gameInfo.selectedCards[i].attr('isopened') == 'true'){
											//console.log("closeCard");
											gameInfo.selectedCards[i].attr('isopened','false');
											_flipCard(gameInfo.selectedCards[i]);
									}
							}
					}
					gameInfo.selectedCards=[];
			}
	};
	
	var _isTheSamePic = function(){
			var issame = false;
			if(gameInfo.selectedCards[0].attr('cardName') == gameInfo.selectedCards[1].attr('cardName')){
				issame = true;
			}
			return issame;
	};

	var _flipCard = function(card){
			// 切换的顺序如下
			// 1. 当前在前显示的元素翻转90度隐藏, 动画时间225毫秒
			// 2. 结束后，之前显示在后面的元素逆向90度翻转显示在前
			// 3. 完成翻面效果
			var back = card.find('.in');
			var front = card.find('.out');
			back.addClass("out").removeClass("in");
			setTimeout(function() {
					front.addClass("in").removeClass("out");
			}, 225);
	}
	
	var _timerFn = function(){
			gameStaus.remainTime -= 1;
			if(gameStaus.remainTime >= 0){
					$("#clock").html(gameStaus.remainTime);
			}else{
					clearInterval(gameInfo.timerInterval);
					_updateStatus("FAILED");
			}
	}
	
	module.exports={
			setUp : function(_gameCanvas, _imgs){
					gameInfo.canvas = _gameCanvas;
					gameInfo.cardImgs = _imgs;
					gameInfo.cardsNum = 20;
					gameInfo.shuffleTimes = 8;
					_gameCanvas.empty();
					_render(_shuffleCard(gameInfo.cardImgs, gameInfo.cardsNum , gameInfo.shuffleTimes) , _gameCanvas);
			},
			
			start : function(statusChangesCallback){
				gameStaus.score=0;
				gameStaus.remainTime = 60;
				gameStaus.statusChangedNotification = statusChangesCallback;
				$("#score").html(gameStaus.score);
				$("#clock").html(gameStaus.remainTime);
				
				
				if(gameInfo.timerInterval != null){
						clearInterval(gameInfo.timerInterval);
						gameInfo.timerInterval=null;
				}
				gameInfo.timerInterval = setInterval(_timerFn, 1000); 
			}
		
	}


});