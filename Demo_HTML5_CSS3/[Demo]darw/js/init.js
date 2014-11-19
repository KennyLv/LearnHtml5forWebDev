define(function(require, exports, module) {
	// 加载Zepto核心组件和选择器组件
	var $ = require('./zepto/zepto'),$=require('./zepto/animationShow');
	var darwCanvas = require('./darwCanvas');
	
	$(function(){
			var loadCanvas = document.getElementById("clearCanvas");//
			var canvaStyle={
					"width" : "600",
					"height" : "300",
					"top" : "100",
					"left" : "100",
					"cover_start_x" : "100",
					"cover_start_y" : "50",
					"cover_width" : "50",
					"cover_height" : "50"
			};
			var printStyle = {
					finishedPercent : 0.3,
					brush : 10
			}
			var onFinishedFn = function(){
					console.log("finished...");
					darwCanvas.reDrawCanvas();
			}
			darwCanvas.showCanvas(loadCanvas, canvaStyle, printStyle, onFinishedFn);
	});
	
	
});