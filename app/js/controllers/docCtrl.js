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
		backendAPI.fetchDocs(function(data) { 
			$scope.docs = data;
		});
	}
});
