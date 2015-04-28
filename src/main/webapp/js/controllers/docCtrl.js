angular.module('jboss-forge').controller('docCtrl', function($scope, backendAPI){
	backendAPI.fetchDocs(function(data) { 
		$scope.docs = data;
	});
});