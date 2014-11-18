define(function(require, exports, module) {
	// 加载Zepto核心组件和选择器组件
	var $ = require('./zepto/zepto'),$=require('./zepto/animationShow');
	var darwCanvas = require('./darwCanvas');
	
	$(function(){
	
			var loadCanvas = document.getElementById("clearCanvas");//
			var canvaStyle={
					"width" : "300",
					"height" : "120",
					"top" : "10",
					"left" : "10"
			};
			var printStyle = {
					finishedPercent : 0.6,
					brush : 15
			}
			var onFinishedFn = function(){
					console.log("finished...");
					darwCanvas.reDrawCanvas();
			}
			darwCanvas.showCanvas(loadCanvas, canvaStyle, printStyle, onFinishedFn);
	});
	
	
});