angular.module('jboss-forge').controller('newsCtrl', function($scope, backendAPI){
	backendAPI.fetchNews(function(data) { 
		$scope.news = data;
	});
});