angular.module('jboss-forge').controller('rootCtrl', function($scope){
	$scope.$on('$viewContentLoaded', function(event) {
		setTimeout(function() {
			initializeUI();
		},1000);
	});
	$scope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 0;
	});	
});