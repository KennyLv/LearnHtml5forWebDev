define(function(require, exports, module) {
	// 加载Zepto核心组件和选择器组件
	var $ = require('./lib/zepto/zepto'),$=require('./lib/zepto/animationShow');
	var utils = require('./utils/utils');
	var darwCanvas = require('./darwCanvas');
	
	$(function(){
	
			var loadCanvas = document.getElementById("clearCanvas");//
			var canvaStyle={
					"width" : "300",
					"height" : "120",
					"top" : "20",
					"left" : "120"
			};
			var printStyle = {
					finishedPercent : 0.2,
					brush : 15
			}
			var onFinishedFn = function(){
					alert("OK");
			}
			darwCanvas.ShowCanvas(loadCanvas, canvaStyle, printStyle, onFinishedFn);
	});
	
	
});