define(function(require, exports, module) {
	var css = require('../css/tibooslider.css');

	var _defaultOptions = {
		effect : "fade", //fade：渐显；|| top：上滚动；|| left：左滚动；|| topLoop：上循环滚动；|| leftLoop：左循环滚动；
		delayTime : 500, //效果持续时间
		interTime : 2500, //自动运行间隔。当effect为无缝滚动的时候，相当于运行速度。
		defaultIndex : 0, //默认的当前位置索引。0是第一个
		titCell : ".hd li", //导航元素
		mainCell : ".bd", //内容元素的父层对象
		trigger : "mouseover", //触发方式 || mouseover：鼠标移过触发；|| click：鼠标点击触发；
		scroll : 1, //每次滚动个数。
		vis : 1, //visible，可视范围个数，当内容个数少于可视个数的时候，不执行效果。
		titOnClassName : "on", //当前位置自动增加的class名称
		autoPage : false, //系统自动分页，当为true时，titCell则为导航元素父层对象，同时系统会在titCell里面自动插入分页li元素(1.2版本新增)
		guideButton : false, //prevCell:".prev",//前一个按钮元素。	//nextCell:".next"//后一个按钮元素。
		autoPlay : false //自动运行
	};

	var opts = {};
	var index, oldIndex;
	var navObj, conBox, pagemarker;
	//导航子元素结合
	var navObjSize, conBoxSize;
	//内容元素父层对象
	var slideH = 0, slideW = 0, selfW = 0, selfH = 0;
	var inter = null;
	//setInterval名称
	var onNotifyChangedFn = null, onNotifySlectedFn = null;

	var _setUpSlider = function(_options) {
		opts = $.extend({}, _defaultOptions, _options);
		index = opts.defaultIndex;
		oldIndex = index;
	}
	var _renderSlider = function(_gameCanvas, _displayData, _onConstructErrorFn, _onConstructSucceedFn) {
		var html = "<ul class='cc' id='jQSlideul'>";
		for (var index = 0; index < _displayData.length; index++) {
			html += "<li><img src='" + _displayData[index].src + "' alt=''/></li>";
		}
		html += "</ul>";
		_gameCanvas.append(html);

		//prevBtn = jQuery(opts.prevCell, jQuery(this));
		//nextBtn = jQuery(opts.nextCell, jQuery(this));

		//conBox = jQuery(opts.mainCell , jQuery(this));//内容元素父层对象
		//navObj = $(opts.titCell, jQuery(this));//导航子元素结合
		conBox = $("#jQSlideul");
		navObj = $("#jQSlideul li");
		conBoxSize = conBox.children().size();
		navObjSize = navObj.size();

		if (conBoxSize < opts.vis) {
			var message = "当内容个数少于可视个数，不执行切换效果。";
			return _onConstructErrorFn(message);
		}
		if (opts.guideButton) {
			_gameCanvas.append("<div id='nextBtn'> &gt; </div>");
			_gameCanvas.append("<div id='previousBtn'> &lt; </div>");
		}
		//处理分页
		if (navObjSize == 0) {
			navObjSize = conBoxSize;
		}
		if (opts.autoPage) {
			var navhtml = "<div class='pageNavUl'>";
			for (var index = 0; index < _displayData.length; index++) {
				navhtml += "<div class='pageNavLi'></div>";
			}
			navhtml += "</div>";
			_gameCanvas.append(navhtml);
			pagemarker = $(".pageNavLi");
		}

		conBox.children().each(function() {//取最大值
			if ($(this).width() > selfW) {
				selfW = $(this).width();
				//slideW=$(this).outerWidth(true);
			}
			if ($(this).height() > selfH) {
				selfH = $(this).height();
				//slideH=$(this).outerHeight(true);
			}
		});
		switch(opts.effect) {
			case "fade":
				conBox.children().css("position", "absolute");
				break;
			case "top":
				conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + opts.vis * selfH + 'px"></div>').css({
					"position" : "relative",
					"padding" : "0",
					"margin" : "0"
				}).children().css({
					"height" : selfH
				});
				break;
			case "left":
				conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + opts.vis * selfW + 'px"></div>').css({
					"width" : conBoxSize * selfW,
					"position" : "relative",
					"overflow" : "hidden",
					"padding" : "0",
					"margin" : "0"
				}).children().css({
					"float" : "left",
					"width" : selfW
				});
				break;
			case "leftLoop":
				conBox.children().clone().appendTo(conBox).clone().prependTo(conBox);
				conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + opts.vis * selfW + 'px"></div>').css({
					"width" : conBoxSize * selfW * 3,
					"position" : "relative",
					"overflow" : "hidden",
					"padding" : "0",
					"margin" : "0",
					"left" : -conBoxSize * selfW
				}).children().css({
					"float" : "left",
					"width" : selfW
				});
				break;
			case "topLoop":
				conBox.children().clone().appendTo(conBox).clone().prependTo(conBox);
				conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + opts.vis * selfH + 'px"></div>').css({
					"height" : conBoxSize * selfH * 3,
					"position" : "relative",
					"padding" : "0",
					"margin" : "0",
					"top" : -conBoxSize * selfH
				}).children().css({
					"height" : selfH
				});
				break;
		}

		return _onConstructSucceedFn();

	}
	var doPlay = function() {

		switch(opts.effect) {
			//case "fade":
			case "top":
			case "left":
				if (index >= navObjSize) {
					index = 0;
				} else if (index < 0) {
					index = navObjSize - 1;
				}
				break;
			case "leftMarquee":
			case "topMarquee":
				if (index >= 2) {
					index = 1;
				} else if (index < 0) {
					index = 0;
				}
				break;
			case "leftLoop":
			case "topLoop":
				var tempNum = index - oldIndex;
				if (navObjSize > 2 && tempNum == -(navObjSize - 1))
					tempNum = 1;
				if (navObjSize > 2 && tempNum == (navObjSize - 1))
					tempNum = -1;
				var scrollNum = Math.abs(tempNum * opts.scroll);
				if (index >= navObjSize) {
					index = 0;
				} else if (index < 0) {
					index = navObjSize - 1;
				}
				break;
		}

		switch (opts.effect) {
			case "fade":
				conBox.children().animate({'opacity' : 0}, opts.delayTime, 'ease-out');
				if (index >= navObjSize) {
					index = 0;
				} else if (index < 0) {
					index = navObjSize - 1;
				}
				conBox.children().eq(index).animate({ 'opacity' : 1}, opts.delayTime, 'ease-out', _onPlayFinished("fade",index));
					
				break;

			case "top":
				//conBox.stop(true,true).animate({"top":-index*opts.scroll*selfH},opts.delayTime);
				conBox.animate({
					"top" : -index * opts.scroll * selfH
				}, opts.delayTime, _onPlayFinished("top",index));
				break;

			case "left":
				conBox.animate({
					"left" : -index * opts.scroll * selfW
				}, opts.delayTime, _onPlayFinished("left" , index));
				break;

			case "leftLoop":
				if (tempNum < 0) {
					//conBox.stop(true,true).animate(
					conBox.animate({
						"left" : -(conBoxSize - scrollNum ) * selfW
					}, opts.delayTime, function() {
						for (var i = 0; i < scrollNum; i++) {
							conBox.children().last().prependTo(conBox);
						}
						conBox.css("left", -conBoxSize * selfW);
						_onPlayFinished("leftLoop -" , index);
					});
				} else {
					//conBox.stop(true,true).animate(
					conBox.animate({
						"left" : -(conBoxSize + scrollNum) * selfW
					}, opts.delayTime, function() {
						for (var i = 0; i < scrollNum; i++) {
							conBox.children().first().appendTo(conBox);
						}
						conBox.css("left", -conBoxSize * selfW);
						_onPlayFinished("leftLoop +" , index);
					});
				}
				break;

			case "topLoop":
				if (tempNum < 0) {
					//conBox.stop(true,true).animate(
					conBox.animate({
						"top" : -(conBoxSize - scrollNum ) * selfH
					}, opts.delayTime, function() {
						for (var i = 0; i < scrollNum; i++) {
							conBox.children().last().prependTo(conBox);
						}
						conBox.css("top", -conBoxSize * selfH);
						_onPlayFinished("topLoop -" , index);
					});
				} else {
					//conBox.stop(true,true).animate(
					conBox.animate({
						"top" : -(conBoxSize + scrollNum) * selfH
					}, opts.delayTime, function() {
						for (var i = 0; i < scrollNum; i++) {
							conBox.children().first().appendTo(conBox);
						}
						conBox.css("top", -conBoxSize * selfH);
						_onPlayFinished("topLoop +" , index);
					});
				}
				break;

		}//switch end

		navObj.removeClass(opts.titOnClassName).eq(index).addClass(opts.titOnClassName);
		oldIndex = index;
	};

	var _onPlayFinished = function(debug_type, index) {
		if (opts.autoPage) {
			pagemarker.css("background-color", "red").eq(index).css("background-color", "yellow");
		}
		if (onNotifyChangedFn != null) {
			onNotifyChangedFn(index);
		}
	}
	
	var _bindevent = function() {
		if (opts.autoPlay) {
			//自动播放
			inter = setInterval(function() {
				index++;
				doPlay();
			}, opts.interTime);
		} else {
			navObj.click(function() {
				//index++;
				//doPlay();
				onNotifySlectedFn(index);
			});
		}

		if (opts.guideButton) {
			$("#nextBtn").click(function() {
					_playNext();
			});
			$("#previousBtn").click(function() {
					_playPrevious();
			});
		}
	}
	
	var _playNext = function(){
				index++;
				doPlay();
	};
	var _playPrevious = function(){
				index--;
				doPlay();
	};


	module.exports = {
		init : function(_gameCanvas, _options, _displayData, _onConstructErrorFn, _onConstructSucceedFn) {
			_setUpSlider(_options);
			_renderSlider(_gameCanvas, _displayData, _onConstructErrorFn, _onConstructSucceedFn);
			doPlay();
		},
		registerDisplayChangedListener : function(_fn) {
			onNotifyChangedFn = _fn;
		},
		registerSlectedListener : function(_fn) {
			onNotifySlectedFn = _fn;
		},
		getReadyForPlay : function(statusChangesCallback) {
			_bindevent();
		},
		next : function() {
			_playNext();
		},
		previous : function() {
			_playPrevious();
		}
	}

}); 