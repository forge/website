angular.module('jboss-forge').controller('downloadCtrl', function($scope, backendAPI){
	backendAPI.fetchMetadata(function(data) { 
		$scope.metadata= data;
	});
});