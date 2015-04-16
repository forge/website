angular.module('jboss-forge').controller('RootController', function($scope){
	$scope.$on('$stateChangeSuccess', function(event) {
		initializeUI();
	})
});