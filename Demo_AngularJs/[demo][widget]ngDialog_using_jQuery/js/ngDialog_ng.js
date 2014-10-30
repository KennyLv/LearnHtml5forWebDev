
angular.module("ngDialog",[])

.directive('newDialog', function factory() {
			return {
						priority:100,
						template: ['<div ng-show="visible">',
											'    <h3>{{title}}</h3>',
											'    <div class="body" ng-transclude></div>',
											'    <div class="footer">',
											'        <button ng-click="onOk()">OK</button>',
											'        <button ng-click="onCancel()">Close</button>',
											'    </div>',
											'</div>'].join(""),
						replace:false,
						transclude: true,
						restrict:'E',
						scope:{
									title:"@",//引用dialog标签title属性的值
									onOk:"&",//以wrapper function形式引用dialog标签的on-ok属性的内容
									onCancel:"&",//以wrapper function形式引用dialog标签的on-cancel属性的内容
									visible:"@"//引用dialog标签visible属性的值
						}
			};
})

.directive('myDialog', function() {
		return {
				restrict: 'E',
				transclude: true,
				templateUrl: 'index_ng_temp.html',
				scope: {
						'close': '&onClose'
				}, 
				link: function (element, scope) {
						scope.name = 'Jeff';
				}
		}
}).directive('myDraggable', function($document) {
				return function(scope, element, attr) {
						
						element.css({
								position: 'relative',
								border: '10px solid red',
								width: '100px',
								height: '20px',
								backgroundColor: 'lightgrey',
								cursor: 'pointer'
						});
						
						var startX = 0, startY = 0, x = 0, y = 0;
						element.on('mousedown', function(event) {
								// Prevent default dragging of selected content
								event.preventDefault();
								startX = event.screenX - x;
								startY = event.screenY - y;
								$document.on('mousemove', mousemove);
								$document.on('mouseup', mouseup);
						});

						function mousemove(event) {
								y = event.screenY - startY;
								x = event.screenX - startX;
								element.css({
										top: y + 'px',
										left:  x + 'px'
								});
						}

						function mouseup() {
								$document.unbind('mousemove', mousemove);
								$document.unbind('mouseup', mouseup);
						}
				};
});

