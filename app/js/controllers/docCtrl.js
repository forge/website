angular.module('jboss-forge').controller('docCtrl', function($scope, $stateParams, backendAPI){
	if ($stateParams.docId) {
		backendAPI.fetchDocById($stateParams.docId, function (selectedDoc) { 
			$scope.selectedDoc = selectedDoc;
		});
		backendAPI.fetchDocContents($stateParams.docId, function (_htmlContents) { 
			$scope.docContents = _htmlContents;
		});
		backendAPI.fetchDocToc($stateParams.docId, function (_htmlContents) { 
			$scope.docToc = _htmlContents;
		});		
	} else { 
		backendAPI.fetchDocs(function(data) { 
			$scope.docs = data;
			// var tags = [];
			// data.forEach(function (item) {
			// 	item.tags.split(',').forEach(
			// 		function(tag) {
			// 			tags.push(tag.trim());
			// 		}
			// 	);
			// });
			// $scope.docsCategories = 			
			// 	tags.filter(function (item, pos, self) {
			// 		return self.indexOf(item) == pos;			
			// 	}
			// );
			// $scope.selectedCategories = [];
			// $scope.addCategory = function(item, selectedCategories) {
		 //        var i = $.inArray(item, selectedCategories);
		 //        if (i > -1) {
		 //            selectedCategories.splice(i, 1);
		 //        } else {
		 //            selectedCategories.push(item);
		 //        }
			// }
			// $scope.clearCategories = function() { 
			// 	$scope.selectedCategories = [];
			// }
			// $scope.categoryFilter = function(item) {
		 //        if ($scope.selectedCategories.length > 0) {
		 //        	var allTags = item.tags.split(',');
		 //        	for (i=0;i<$scope.selectedCategories.length;i++) 
		 //        	{
			// 			if (item.tags.contains($scope.selectedCategories[i])) { 
			// 				return item;
			// 			}
		 //        	}
		 //        	return;
		 //        }
			// 	return item;
			// }

		});
	}	
});