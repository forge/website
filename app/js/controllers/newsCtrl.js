angular.module('jboss-forge').controller('newsCtrl', function($scope, $stateParams, backendAPI){
	if ($stateParams.newsId) {
		backendAPI.fetchNewsContents($stateParams.newsId, function (_htmlContents) { 
			$scope.newsContents = _htmlContents;
		});
		backendAPI.fetchNewsToc($stateParams.newsId, function (_htmlContents) { 
			$scope.newsToc = _htmlContents;
		})		
	} else { 
		backendAPI.fetchNews(function(data) { 
			$scope.news = data;
			var tags = [];
			data.forEach(function (item) {
				item.tags.split(',').forEach(
					function(tag) {
						tags.push(tag.trim());
					}
				);
			});
			$scope.newsCategories = 			
				tags.filter(function (item, pos, self) {
					return self.indexOf(item) == pos;			
				}
			);
			$scope.selectedCategories = [];
			$scope.addCategory = function(item, selectedCategories) {
		        var i = $.inArray(item, selectedCategories);
		        if (i > -1) {
		            selectedCategories.splice(i, 1);
		        } else {
		            selectedCategories.push(item);
		        }
			}

			$scope.clearCategories = function() { 
				$scope.selectedCategories = [];
			}
			$scope.categoryFilter = function(item) {
		        if ($scope.selectedCategories.length > 0) {
		        	var allTags = item.tags.split(',');
		        	for (i=0;i<$scope.selectedCategories.length;i++) 
		        	{
						if (item.tags.contains($scope.selectedCategories[i])) { 
							return item;
						}
		        	}
		        	return;
		        }
				return item;
			}

		});
	}
});