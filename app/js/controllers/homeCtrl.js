angular.module('jboss-forge').controller('homeCtrl', function($scope, backendAPI){
	backendAPI.fetchContributors(function(data) { 
		$scope.contributors = data;
	});
});