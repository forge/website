angular.module('jboss-forge').controller('addonCtrl', function($scope, $stateParams, backendAPI){
	backendAPI.fetchAddons(function(data) { 
		$scope.addons = data;
	});
	var selectAddon = function(addon) { 
		$scope.selectedAddon = addon;
		backendAPI.fetchAddonDocsById(addon.id, function(data) {
			$scope.docSections = data;
		});
	}
	
	$scope.setSelectedAddon = selectAddon;
	$scope.fetchDocContents = function(addonId, docId) { 
		backendAPI.fetchAddonDocContentsById(addonId, docId, function (data) {
			$scope.selectedAddon.docContents = data;
		});
	}
	if ($stateParams.addonId) { 
		backendAPI.fetchAddonById($stateParams.addonId, function(addon) {
			selectAddon(addon);
			productModal();
		});
	}
});