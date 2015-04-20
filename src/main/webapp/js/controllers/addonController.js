angular.module('jboss-forge').controller('AddonController', function($scope, $http){
	// TODO: Fetch from REST service
	$scope.addons = 
	{ 
		'community':
		[
		{
			id: 'org.jboss.forge.addon:reflections',
			name: 'Reflections', 
			description: 'Enables the usage of the Reflections library as project facets for Java runtime metadata analysis', 
			author:'George Gastaldi', 
			rating: 5,
		}
		], 
		'core':
		[
		{
			id: 'org.jboss.forge.addon:gradle',
			name: 'Gradle', 
			description: 'Enables Grade in your project', 
			author:'Lincoln Baxter III', 
			rating: 3,
			logo: 'https://pbs.twimg.com/profile_images/2149314222/square.png',
		}
		]
	};
	$scope.setSelectedAddon = function(addon) {
		$scope.selectedAddon = addon;
	}
});