define(function(require, exports, module) {

	var cardcss = require('../css/card.css');
	var animate = require('../css/animate.css');
	
	var gameInfo = {
			canvas:null,
			timerInterval : null,
			card_back : "./img/card_back.jpg",
			cardsNum : 16,
			timeLimit:60,
			cardImgs : []
	};
	
	var selectedCards = [];
	var statusChangedNotification = null;
	
	var gameStaus = {
			score : 0,
			remainTime : 60,
			status : "STOPPED" // "STARTED" "FINISHED" "FAILED"
			
	}
	
	var _updateStatus = function(_status){
			gameStaus.status= _status;
			if(statusChangedNotification != null){
					statusChangedNotification(gameStaus);
			}
	}
	
	var _shuffleCard = function(_cardImgs){
			//随机选择图片生产卡牌总数一半的牌
			var chooseParis = [];
			var imgNum = _cardImgs.length;
			var half= Math.floor( (gameInfo.cardsNum)/2);
			
			for(var j=0; j<half; j++){
					var	r = Math.floor(Math.random() * imgNum);
					chooseParis.push(_cardImgs[r]);
			}
			
			//所有牌乘二
			var newArray = chooseParis.concat(chooseParis);
			
			//洗牌算法，任意多次轮洗
			for(var idx=0; idx< gameInfo.cardsNum; idx++) {
					var	i = Math.floor(Math.random() * gameInfo.cardsNum);
					var  j = Math.floor(Math.random() * gameInfo.cardsNum);
					var temp = newArray[i];
					newArray[i] = newArray[j];
					newArray[j] = temp;
			}
			return newArray;
	}
	
	var _cardCreator = function(_cardId, _cardName, _cardImg){
			var cardHtml =	'<div class="card">'
						+'<div class="box viewport-flip" cardId=card_' + _cardId + '  isopened="false" cardName="'+ _cardName +'" >'
						+'<div class="list flip out"><img src="' + _cardImg + '" alt="card front"></div>'
						+'<div class="list flip in"><img src="'+ gameInfo.card_back +'" alt="card back"></div>'
						+'</div>'
						+'</div>';
			return cardHtml;
	}
	
	var _render = function(_cardArr, cardCanvas){
	
			for(var index=0; index <_cardArr.length; index++){
					cardCanvas.append(_cardCreator(index, _cardArr[index].id, _cardArr[index].src));
			}
			$(".box").bind("click", function(e) {
			//$(".box").on('touchstart',function(e){
					e.preventDefault(); // 阻止"默认冒泡行为"
					var currentCard = $(this);
					if(currentCard.attr('isopened') == 'false' && selectedCards.length <2){
							currentCard.attr('isopened','true');
							_flipCard(currentCard);
							selectedCards.push(currentCard);
							if(selectedCards.length >1){
									setTimeout(function() {
											_checkCard();
									},400);
							}
					}
					return false;
			});
	}
	
	var _checkCard = function(){
			if(selectedCards.length >1){
					//console.log("opened " + selectedCards.length);
					if(_isTheSamePic()){
							for(var i = 0; i < selectedCards.length; i++){
									selectedCards[i].parent().empty();
							}
							gameStaus.score += 1;
							$("#score").html("得分 : " + gameStaus.score);
							if($(".box").length <1){
									_updateStatus("FINISHED");
									clearInterval(gameInfo.timerInterval);
							}
							
					}else{
							for(var i = 0; i < selectedCards.length; i++){
									if(selectedCards[i].attr('isopened') == 'true'){
											//console.log("closeCard");
											selectedCards[i].attr('isopened','false');
											_flipCard(selectedCards[i]);
									}
							}
					}
					selectedCards=[];
			}
	};
	
	var _isTheSamePic = function(){
			var issame = false;
			if(selectedCards[0].attr('cardName') == selectedCards[1].attr('cardName')){
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
			/*back.animate({transform: "rotateY(90deg) scale(.9)"},225,function(){
					//back.addClass("out").removeClass("in");
					front.animate({transform: "rotateY(0deg) scale(.9)"},225,function(){
							//front.addClass("in").removeClass("out");
					});
					
			});*/
			back.addClass("out").removeClass("in");
			setTimeout(function() {
					front.addClass("in").removeClass("out");
			}, 225);
	}
	
	var _timerFn = function(){
			gameStaus.remainTime -= 1;
			if(gameStaus.remainTime >= 0){
					$("#clock").html("剩余时间 : " + gameStaus.remainTime);
			}else{
					_updateStatus("FAILED");
					clearInterval(gameInfo.timerInterval);
			}
	}
	
	module.exports={
			setUp : function(_gameCanvas, _imgs, _backImg , _options, statusChangesCallback ){
					gameInfo.canvas = _gameCanvas;
					gameInfo.cardImgs = _imgs;
					gameInfo.card_back = _backImg;
					gameInfo.cardsNum = _options.totalCardsNum;//20;
					gameInfo.timeLimit = _options.timeLimit;// 60;
					_gameCanvas.empty();
					statusChangedNotification = statusChangesCallback;
					var shuffedCards = _shuffleCard(gameInfo.cardImgs);
					_render(shuffedCards , _gameCanvas);
			},
			
			start : function(){
				gameStaus.score=0;
				gameStaus.remainTime = gameInfo.timeLimit;
				_updateStatus("STARTED");
				selectedCards = [];
				$("#score").html("得分 : " + gameStaus.score);
				$("#clock").html("剩余时间 : " + gameStaus.remainTime);
				
				
				if(gameInfo.timerInterval != null){
						clearInterval(gameInfo.timerInterval);
						gameInfo.timerInterval=null;
				}
				gameInfo.timerInterval = setInterval(_timerFn, 1000); 
			}
		
	}


});