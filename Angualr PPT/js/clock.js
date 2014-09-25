window.onload = function() {
		//var winHeight = document.documentElement.clientHeight;
		//document.getElementsByTagName('body')[0].style.height = winHeight + 'px';
		
		var $cover_box = document.getElementById('coverbox');
		var $min_counter = document.getElementById('mincounter');
		
		var $clock = document.getElementById('clock');
		//var $date = document.getElementById('date');
		//var $hour = document.getElementById('hour');
		//var $min = document.getElementById('min');
		var $sec = document.getElementById('sec');
		//添加刻度
		var oSecs = document.createElement('em');
		
		for (var i = 1; i < 61; i++) {
			var tempSecs = oSecs.cloneNode(), pos = getSecPos(i);
			if (i % 5 == 0) {
				tempSecs.className = 'ishour';
				tempSecs.innerHTML = '<i style="-webkit-transform:rotate(' + (-i * 6) + 'deg);">' + (i / 5) + '</i>';
			}
			tempSecs.style.cssText = 'left:' + pos.x + 'px; top:' + pos.y + 'px; -webkit-transform:rotate(' + i * 6 + 'deg);';
			$clock.appendChild(tempSecs);
		}
		// 圆弧上的坐标换算
		function getSecPos(dep) {
			var hudu = (2 * Math.PI / 360) * 6 * dep, r = 200;
			//半径大小
			return {
				x : Math.floor(r + Math.sin(hudu) * r),
				y : Math.floor(r - Math.cos(hudu) * r),
			}
		};
		
		var _startTime = new Date();
		
		(function() {
			// 当前时间
			var _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
			
			/*
			//绘制日期
			var _day = _now.getDay();
			_day = (_day == 0) ? 7 : _day;
			if (_day == 1) {
				_day = "一";
			} else if (_day == 2) {
				_day = "二";
			} else if (_day == 3) {
				_day = "三";
			} else if (_day == 4) {
				_day = "四";
			} else if (_day == 5) {
				_day = "五";
			} else if (_day == 6) {
				_day = "六";
			} else if (_day == 7) {
				_day = "日";
			}
			$date.innerHTML = _now.getFullYear() + '-' + (_now.getMonth() + 1) + '-' + _now.getDate() + ' 星期' + _day;
			*/
			
			var tickInterval = 1000;
			//绘制时钟
			var gotime = function() {
				var _h_dep = 0;
				_s += (tickInterval/1000); //
				if (_s > 59) {
					_s = 0;
					_m++;
					$min_counter.innerHTML = (_h - _startTime.getHours()) * 60 + (_m - _startTime.getMinutes()) + " Mins";
				}
				if (_m > 59) {
					_m = 0;
					_h++;
				}
				/*if (_h > 12) {
					_h = _h - 12;
				}*/
				//时针偏移距离
				_h_dep = Math.floor(_m / 12) * 6;
				//$hour.style.cssText = '-webkit-transform:rotate(' + (_h * 30 - 90 + _h_dep) + 'deg);';
				//$min.style.cssText = '-webkit-transform:rotate(' + (_m * 6 - 90) + 'deg);';
				$sec.style.cssText = '-webkit-transform:rotate(' + (_s * 6 - 90) + 'deg);';
				
				//
				var angle = (2*Math.PI*(_s * 6 - 180)) /360;
				$clock.style.top =  -150 - 180*Math.cos( angle) + 'px';
				$clock.style.left = -150 + 180*Math.sin(angle) + 'px';
				
			};
			gotime();
			setInterval(gotime, tickInterval);
		})();
	};