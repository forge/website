angular.module('jboss-forge').controller('addonCtrl', function($scope, $stateParams, backendAPI){
	backendAPI.fetchAddons(function(data) { 
		$scope.addons = data;
	});
	$scope.setSelectedAddon = function(addon) {
		$scope.selectedAddon = addon;
	}
	if ($stateParams.addonId) { 
		backendAPI.fetchAddonById($stateParams.addonId, function(addon) {
			$scope.selectedAddon = addon;
			productModal();
		});
	}
});