angular.module('jboss-forge').controller('addonCtrl', function($scope, backendAPI){
	backendAPI.fetchAddons(function(data) { 
		$scope.addons = data;
	});
	$scope.setSelectedAddon = function(addon) {
		$scope.selectedAddon = addon;
	}
});