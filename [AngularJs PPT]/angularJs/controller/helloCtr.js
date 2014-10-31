
app.directive('Names', function() {
  return {
			restrict: 'EA',
			//templateUrl: 'angualrJs/view_templates/myTips.html',
			template :'<ul></ul>',
  }
});

app.controller('helloCtr', ['$scope', function($scope) {
		$scope.Names= [{
				"name": "Tom",
				"description": "This is Tom ..."
			},
			{
				"name": "Emma",
				"description": "Emma is short for AYAMAYA ..."
			}];
		$scope.viewDetail = function(i){
			alert(	$scope.Names[i].description );
		}
}]);