
app.directive('myTips', function() {
  return {
			restrict: 'EA',
			templateUrl: 'angualrJs/view_templates/myTips.html',
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