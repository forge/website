angular.module('jboss-forge').controller('communityCtrl', function($scope, backendAPI){
	backendAPI.fetchContributors(function(data) { 
		$scope.contributors = data;
	});
});