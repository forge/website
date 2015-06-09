angular.module('jboss-forge').controller('addonCtrl', function($scope, $stateParams, backendAPI){
	backendAPI.fetchAddons(function(data) { 
		$scope.addons = data;
		var tags = [];
		for (type in data) { 
			data[type].forEach(function (item) {
				if (item.tags) {
					item.tags.split(',').forEach(
						function(tag) {
							tags.push(tag.trim().toLowerCase());
						}
					);
				}
			});
		}
		$scope.addonTags = tags.filter(function (item, pos, self) {
			return self.indexOf(item) == pos;			
		}).sort();
		$scope.selectedTags = [];
		$scope.addTag = function(item, selectedTags) {
			var i = $.inArray(item, selectedTags);
			if (i > -1) {
				selectedTags.splice(i, 1);
			} else {
				selectedTags.push(item);
			}
		}
		$scope.clearTags = function() { 
			$scope.selectedTags = [];
		}
		$scope.tagFilter = function(item) {
			if ($scope.selectedTags.length > 0) {
				for (i=0;i<$scope.selectedTags.length;i++) 
				{
					if (item.tags && item.tags.contains($scope.selectedTags[i])) { 
						return item;
					}
				}
				return;
			}
			return item;
		}
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