angular.module('jboss-forge').controller('docCtrl', function(){
	$scope.docs = [
	{
		level: 'beginner',
		group: 'core',
		doc: 'blogpost',
		title: 'Forge shell with Cygwin and Wildfly',
		summary: 'Running Forge shell with Cygwin and deploying the generated app in Wildfly'
	},
	{
		level: 'expert',
		group: 'core',
		doc: 'tutorial',
		title: 'Write a Java EE Web Application - Advanced',
		summary: 'Use Forge to create a entire Java EE Web application.'
	},	
	{
		level: 'expert',
		group: 'core',
		doc: 'tutorial',
		title: 'Write a Java EE Web Application - Advanced',
		summary: 'Use Forge to create a entire Java EE Web application.'
	}
	];
});