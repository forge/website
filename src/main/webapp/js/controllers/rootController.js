angular.module('jboss-forge').controller('RootController', function($scope){
	$scope.$on('$viewContentLoaded', function(event) {
		initializeUI();
	});
});