angular.module('jboss-forge').controller('newsCtrl', function($scope){
	$scope.news = [
	{ 	
		title : "Forge 2.16.0.Final (Spear) is here",
		summary: "JBoss Forge 2.16.0.Final is now available. Grab it while it is hot!",
		date: new Date(),
		repo: "https://github.com/forge/docs.git",
		ref: "master",
		path: "/news/2015-04-15-forge-2.16.0.final.asciidoc",
		author: "Forge Team",
		email: "forge-dev@lists.jboss.org",
		photo:"http://leapingstag.wdfiles.com/local--files/the-forge/Forge%20Fire%20small.JPG"
	},
	{ 	
		title : "Forge 2.15.0.Final (Morning Star) is here",
		summary: "JBoss Forge 2.15.0.Final is now available. Grab it while it is hot!",
		date: new Date(),
		repo: "https://github.com/forge/docs.git",
		ref: "master",
		path: "/news/2015-04-15-forge-2.14.0.final.asciidoc",
		author: "Forge Team",
		email: "forge-dev@lists.jboss.org"
	}
	];
});