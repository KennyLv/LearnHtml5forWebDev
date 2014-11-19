define(function(require,exports,module){
		var w=0,h=0;
		var cover_start_x=0,cover_start_y=0,cover_width=0,cover_height=0;
		var offsetX=0, offsetY=0;
		var percent = 0.15;
		var stocketWidth = 10;
		var canvas = null;
		var ctx = null;
		var returnFn = null;
		var x = document.getElementById("x");//
		var y = document.getElementById("y");//
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
					var _x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0, _y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
					x.innerText = _x + "-";
					y.innerText = _y + "-";
					with(ctx) {
						beginPath();
						arc(_x, _y, stocketWidth, 0, Math.PI * 2);
						fill();
					}
					
					//console.log("dsad" + x + 'd' + y);
				}
		}
		var eventUp = function(e){
				e.preventDefault();
				mousedown = false;
				
				var data=ctx.getImageData(cover_start_x,cover_start_y,cover_width,cover_height).data;
				
				for(var i=0,j=0;i<data.length;i+=4){
						if(data[i] && data[i+1] && data[i+2] && data[i+3]){
								if(data[i+3] != 0){
										j++;
								}
						}
				}
				if(j<=cover_width*cover_height*percent){
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
					_canvas.width=_style.width;
					_canvas.height=_style.height;
					
					//console.log(_canvas.offsetParent.offsetLeft);
					
					/*var realOffset = getOffset(_canvas,  {"x" : 0, "y" : 0} );
					offsetX = realOffset.x;
					offsetY = realOffset.y;
					*/
					offsetX = _canvas.offsetLeft;
					offsetY = _canvas.offsetTop;
					
					//ctx.strokeStyle = 'red';
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
				cover_start_x = _canvasStyle.cover_start_x;
				cover_start_y = _canvasStyle.cover_start_y;
				cover_width = _canvasStyle.cover_width;
				cover_height = _canvasStyle.cover_height;
				canvas = _canvas;
				ctx=_canvas.getContext('2d');
				_renderCanvas(_canvas, _canvasStyle);
		};
		exports.reDrawCanvas = function() {
			if(canvas !=null){
					console.log("Canvas is not null...");
					ctx.clearRect(0, 0, w, h);
					/*
							source-over	Ĭ�ϡ���Ŀ��ͼ������ʾԴͼ��
							source-atop	��Ŀ��ͼ�񶥲���ʾԴͼ��Դͼ��λ��Ŀ��ͼ��֮��Ĳ����ǲ��ɼ��ġ�
							source-in	��Ŀ��ͼ������ʾԴͼ��ֻ��Ŀ��ͼ���ڵ�Դͼ�񲿷ֻ���ʾ��Ŀ��ͼ����͸���ġ�
							source-out	��Ŀ��ͼ��֮����ʾԴͼ��ֻ����ʾĿ��ͼ��֮��Դͼ�񲿷֣�Ŀ��ͼ����͸���ġ�
							destination-over	��Դͼ���Ϸ���ʾĿ��ͼ��
							destination-atop	��Դͼ�񶥲���ʾĿ��ͼ��Դͼ��֮���Ŀ��ͼ�񲿷ֲ��ᱻ��ʾ��
							destination-in	��Դͼ������ʾĿ��ͼ��ֻ��Դͼ���ڵ�Ŀ��ͼ�񲿷ֻᱻ��ʾ��Դͼ����͸���ġ�
							destination-out	��Դͼ������ʾĿ��ͼ��ֻ��Դͼ�����Ŀ��ͼ�񲿷ֻᱻ��ʾ��Դͼ����͸���ġ�
							lighter	��ʾԴͼ�� + Ŀ��ͼ��
							copy	��ʾԴͼ�񡣺���Ŀ��ͼ��
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
