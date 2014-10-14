
app.directive('myTips', function() {
  return {
			restrict: 'EA',
			//templateUrl: 'angualrJs/view_templates/myTips.html',
			template :'<div class="myTipBox" style="top: {{ tips.style.position.top }};left: {{tips.style.position.left}};">'
											+ '<em class="to-top" ng-show="{{ tips.style.direction==\'t\'}}"></em>'
											+ '<em class="to-right" ng-show="{{ tips.style.direction==\'r\'}}"></em>'
											+ '<em class="to-bottom"  ng-show="{{ tips.style.direction==\'b\'}}"></em>'
											+ '<em class="to-left" ng-show="{{ tips.style.direction==\'l\'}}"></em>'
											+ '<span>{{ tips.contents}}</span>'
											+ '</div>',
			scope:{
				tips : "=tips"
			}
  }
}).controller('myTipsCtr', ['$scope', function($scope) {
		$scope.tips1={contents : 'This is a test 1 !',style:{direction:'r',position:{top:'100px',left:'150px'}}};
		$scope.tips2={contents : 'This is a test 2 !',style:{direction:'r',position:{top:'10px',left:'50px'}}};
		/*
		$scope.updateTips=function(c,d,t,l){
				$scope.Tips={
						contents : c,
						style:{
								direction:d,
								position:{
										top:t,
										left:l
								}
						}
				};
		};*/
		
}]);