angular.module('jboss-forge').service('backendAPI', function($http, config){
	this.fetch = function (_contextPath, _success) { 
		var request = $http.get(config.baseUrl + _contextPath);
		if (_success){ 
			request.success(_success);
		}
		request.error(function() { 
			alert('Sorry, but the requested service is under maintenance.\nDo not worry, a team of high-skilled blacksmiths was dispatched to fix it.');
		});
		return request;
	} 

	this.fetchAddons = function(_success) { 
		return this.fetch('/addons', _success);
	}

	this.fetchDocs = function(_success) { 
		return this.fetch('/docs', _success);
	}

	this.fetchNews = function(_success) { 
		return this.fetch('/news', _success);
	}
});

