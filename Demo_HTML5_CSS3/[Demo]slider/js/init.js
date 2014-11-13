define(function(require, exports, module) {
	var $ = require('./lib/zepto/zepto'),$ = require('./lib/zepto/touch');
	var slider = require('./slider');

	$(function() {
		var sliderCanvas = $("#jQSlide");
		var sliderStyle = {
			effect : "fade", //轮播效果 : fade || top || left || topLoop || leftLoop
			delayTime : 600, //动画时长
			interTime : 4000, //自动轮播间隔时间，减去动画时长即为画面静止时间
			defaultIndex : 0, //默认的当前位置索引，从0开始
			trigger : "click", //触发方式 : mouseover || click
			scroll : 1, //每次滚动的个数
			vis : 1, //可见范围内显示的个数，当内容个数少于可视个数的时候，不执行效果
			autoPage : true, //系统自动分页
			guideButton : true, //前一个/后一个按钮元素
			autoPlay : false //是否自动轮播
		};

		var images = [{
			"key" : "Bridge",
			"src" : "imgs/Bridge.png"
		}, {
			"key" : "Forest",
			"src" : "imgs/Forest.png"
		}, {
			"key" : "Lake",
			"src" : "imgs/Lake.png"
		}, {
			"key" : "Mountains",
			"src" : "imgs/Mountains.png"
		}, {
			"key" : "Rain",
			"src" : "imgs/Rain.png"
		}, {
			"key" : "Water",
			"src" : "imgs/Water.png"
		}];

		onDisplayChangedCallback = function(currentIndex) {
				$("#title").text(images[currentIndex].key);
		};
		onSlectedCallback = function(currentIndex) {
				$("#result").text("you have choose : " + images[currentIndex].key);
		};

		slider.init(sliderCanvas, sliderStyle, images, function(erromsg) {
			console.log("Init Failed : " + erromsg);
		}, function() {
			console.log("Init Succeed");
			slider.registerDisplayChangedListener(onDisplayChangedCallback);
			slider.registerSlectedListener(onSlectedCallback);
			slider.getReadyForPlay();
			
			$("#body").swipeLeft(function(){
					slider.next();
			});
			
			$("#body").swipeRight(function(){
					slider.previous();
			});
			
			
		});
	});

}); 