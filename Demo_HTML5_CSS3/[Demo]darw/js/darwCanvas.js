define(function(require,exports,module){

		var w, h;
		var offsetX=0, offsetY=0;
		var percent = 0.15;
		var stocketWidth = 15;
		var canvas = null;
		var ctx = null;
		var returnFn = null;
		
		var mousedown = false;
		var eventDown = function(e){
				e.preventDefault();
				//console.log("dss");
				mousedown=true;
		}
		var eventMove = function(e){
				e.preventDefault();
				if(mousedown) {
					if(e.changedTouches){
							e=e.changedTouches[e.changedTouches.length-1];
					}
					var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0, y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
					
					with(ctx) {
						beginPath();
						arc(x, y, stocketWidth, 0, Math.PI * 2);
						fill();
					}
					
					//console.log("dsad" + x + 'd' + y);
				}
		}
		var eventUp = function(e){
				e.preventDefault();
				mousedown = false;
				
				var data=ctx.getImageData(0,0,w,h).data;
				for(var i=0,j=0;i<data.length;i+=4){
						if(data[i] && data[i+1] && data[i+2] && data[i+3]){
								j++;
						}
				}
				if(j<=w*h*percent){
						if(typeof (returnFn) === "function"){
								returnFn();
						}
				}
		}
			
		var _renderCanvas = function(_canvas, _style){
					//var _canvas=document.createElement("canvas");
					_canvas.style.mozUserSelect = 'none';
					_canvas.style.webkitUserSelect = 'none';
					_canvas.style.backgroundColor = 'transparent';
					_canvas.style.position = 'absolute';
					_canvas.style.top = _style.top + 'px';
					_canvas.style.left = _style.left + 'px';
					_canvas.style.width=_style.width + 'px';
					_canvas.style.height=_style.height + 'px';
					
					//console.log(_canvas.offsetParent.offsetLeft);
					
					var realOffset = getOffset(_canvas,  {"x" : 0, "y" : 0} );
					offsetX = realOffset.x;
					offsetY = realOffset.y;
					
					ctx.strokeStyle = 'red';
					ctx.fillStyle = '#808080';
					ctx.fillRect(0, 0, w, h);
					ctx.globalCompositeOperation = 'destination-out';
					
					_canvas.addEventListener('touchstart', eventDown);
					_canvas.addEventListener('touchend', eventUp);
					_canvas.addEventListener('touchmove', eventMove);
					_canvas.addEventListener('mousedown', eventDown);
					_canvas.addEventListener('mouseup', eventUp);
					_canvas.addEventListener('mousemove', eventMove);

					//_p.appendChild(_canvas);
					console.log("render canvas finished...");
					//return _canvas;
		}
		
					
		var getOffset = function(ele, _offset){
				var parentNode = ele.offsetParent;
				if(parentNode != null){
					var addedOffsetX = _offset.x +  ele.offsetLeft;
					var addedOffsetY = _offset.y +  ele.offsetTop;
					return getOffset(ele.offsetParent, {"x" : addedOffsetX, "y" : addedOffsetY});
				}else{
					return _offset;
				}
		}
		
    exports.showCanvas = function(_canvas, _canvasStyle, _printStyle, _completeFn) {
				returnFn = _completeFn;
				percent = _printStyle.finishedPercent;
				stocketWidth = _printStyle.brush;
				w = _canvasStyle.width;
				h = _canvasStyle.height;
				canvas = _canvas;
				ctx=_canvas.getContext('2d');
				_renderCanvas(_canvas, _canvasStyle);
		};
		exports.reDrawCanvas = function() {
			if(canvas !=null){
					console.log("Canvas is not null...");
					ctx.clearRect(0, 0, w, h);
					/*
							source-over	默认。在目标图像上显示源图像。
							source-atop	在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。
							source-in	在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。
							source-out	在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。
							destination-over	在源图像上方显示目标图像。
							destination-atop	在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。
							destination-in	在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。
							destination-out	在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
							lighter	显示源图像 + 目标图像。
							copy	显示源图像。忽略目标图像。
					*/
					ctx.globalCompositeOperation = 'lighter'; //source-over,source-out,destination-over,destination-atop,lighter,copy
					ctx.fillStyle = '#808080';
					ctx.fillRect(0, 0, w, h);
					//
					ctx.globalCompositeOperation = 'destination-out';
			}else{
				return "Canvas is null...";
			}
		};
    exports.onNotifyPositionChanged = function() {
			var realOffset = getOffset(canvas,  {"x" : 0, "y" : 0} );
			offsetX = realOffset.x;
			offsetY = realOffset.y;
		};
});
