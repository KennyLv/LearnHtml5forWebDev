function homeCtrl($scope) {		$scope.message = 'With jQuery';}myProjectApp.controller("routerCtrl", ['$scope', '$routeParams',function($scope, $routeParams) {		$scope.currentShow = $routeParams.router_id;}]);myProjectApp.controller("animateCtrl", ['$scope', '$routeParams',function($scope, $routeParams) {		$scope.currentShow = $routeParams.animate_id;}]);myProjectApp.controller("locationCtrl", ['$scope', '$routeParams',function($scope, $routeParams) {		$scope.currentShow = $routeParams.location_id;}]);