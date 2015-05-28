angular.module('jboss-forge').controller('docCtrl', function($scope, $stateParams, backendAPI){
	if ($stateParams.docId) {
		backendAPI.fetchDocById($stateParams.docId, function (selectedDoc) { 
			$scope.doc = selectedDoc;
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
		});
	}	
});