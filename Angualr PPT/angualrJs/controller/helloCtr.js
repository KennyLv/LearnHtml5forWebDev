
app.directive('Names', function() {
  return {
			restrict: 'EA',
			//templateUrl: 'angualrJs/view_templates/myTips.html',
			template :'<ul></ul>',
  }
}).controller('helloCtr', ['$scope', function($scope) {
		$scope.Names= [{
				"name": "Jacke",
				"description": "This is Jacke from Nanjing ..."
			},
			{
				"name": "Emma",
				"description": "Emma is short for AYAMAYA ..."
			}];
		$scope.viewDetail = function(i){
			alert(	$scope.Names[i].description );
		}
}]);