angular.module('jboss-forge').controller('docCtrl', function($rootScope, $scope, $stateParams, backendAPI){
	if ($stateParams.docId) {
		backendAPI.fetchDocById($stateParams.docId, function (selectedDoc) { 
			$scope.doc = selectedDoc;
			$rootScope.title = selectedDoc.title;
		});
		backendAPI.fetchDocContents($stateParams.docId, function (_htmlContents) { 
			$scope.docContents = _htmlContents;
		});
		backendAPI.fetchDocToc($stateParams.docId, function (_htmlContents) { 
			$scope.docToc = (_htmlContents.trim()) ? _htmlContents : "No Content";
		});		
	} else { 
		$scope.levels = ['Beginner', 'Intermediate', 'Advanced'];

		$scope.selectedLevels = [];

		$scope.addLevel = function(item, selectedLevels) {
	        var i = $.inArray(item, selectedLevels);
	        if (i > -1) {
	            selectedLevels.splice(i, 1);
	        } else {
	            selectedLevels.push(item);
	        }
		}
		$scope.clearLevels = function() { 
			$scope.selectedLevels = [];
		}
		$scope.levelFilter = function(item) {		
			if ($scope.selectedLevels.length > 0) {
				for (i=0;i<$scope.selectedLevels.length;i++) {
					if (item.level === $scope.selectedLevels[i]) { 
						return item;
					}
				}
				return;
			}
			return item;
		}

		backendAPI.fetchDocs(function(data) { 
			data.sort(function (item, item2) {
				var idx1 = $scope.levels.indexOf(item.level)
				var idx2 = $scope.levels.indexOf(item2.level);
				return idx1-idx2;
			})
			$scope.docs = data;
		});

	}
});
