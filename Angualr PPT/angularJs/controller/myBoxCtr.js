
app.directive('myBox', function() {
  return {
			restrict: 'EA',
			//templateUrl: 'angualrJs/view_templates/myTips.html',
			template :'<div class="myBox" style="width: {{ boxstyle.w }};height: {{boxstyle.h}};top: {{ boxstyle.t }};left: {{boxstyle.l}};"></div>',
			scope:{
				boxstyle : "=boxstyle"
			}
  }
});