angular.module('jboss-forge').controller('addonCtrl', function($rootScope, $scope, $stateParams, backendAPI){
	if ($stateParams.addonId) { 
		// Addon detail page
		$scope.fetchDocContents = function(addonId, docId) { 
			backendAPI.fetchAddonDocContentsById(addonId, docId, function (data) {		
				$scope.addon.docContents = data;
			});
		}
		backendAPI.fetchAddonById($stateParams.addonId, function(addon) { 
			$rootScope.title = addon.name;
			$scope.addon = addon;
			backendAPI.fetchAddonDocsById(addon.id, function(docSections) {
				$scope.docSections = docSections;
				// Get the readme section
				backendAPI.fetchAddonDocContentsById(addon.id, docSections[0], function (docContents) {
					$scope.addon.docContents = docContents;
				});
			});
		});
	} else { 
		// Addon main page
		backendAPI.fetchAddons(function(data) { 
			$scope.addons = data;
			var tags = [];
			for (type in data) { 
				data[type].forEach(function (item) {
					if (item.tags) {
						item.tags.forEach(
							function(tag) {
								tags.push(tag.trim());
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
						if (item.tags && item.tags.indexOf($scope.selectedTags[i]) > -1) { 
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