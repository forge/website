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
		return this.fetch('/api/addons', _success);
	}

	this.fetchDocs = function(_success) { 
		return this.fetch('/api/docs', _success);
	}

	this.fetchNews = function(_success) { 
		return this.fetch('/api/news', _success);
	}

	this.fetchNewsContents = function(newsId, _success) { 
		return this.fetch('/api/news/' + newsId + '/contents', _success);
	}	
	this.fetchNewsToc = function(newsId, _success) { 
		return this.fetch('/api/news/' + newsId + '/toc', _success);
	}	
});

