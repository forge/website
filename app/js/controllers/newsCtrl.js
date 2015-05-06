angular.module('jboss-forge').controller('newsCtrl', function($scope, $stateParams, backendAPI){
	backendAPI.fetchNews(function(data) { 
		$scope.news = data;
	});
	if ($stateParams.newsId) {
		backendAPI.fetchNewsContents($stateParams.newsId, function (_htmlContents) { 
			$scope.newsContents = _htmlContents;
		});
		backendAPI.fetchNewsToc($stateParams.newsId, function (_htmlContents) { 
			$scope.newsToc = _htmlContents;
		})		
	}
});