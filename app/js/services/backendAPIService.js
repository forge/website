angular.module('jboss-forge').service('backendAPI', function($http, config){
	this.fetch = function (_contextPath, _success) { 
		var url = config.baseUrl + _contextPath;
		var request = $http.get(url);
		if (_success){ 
			request.success(_success);
		}
		request.error(function(err) { 
			alert('Oops, something bad happened while accessing '+url+'.\nLet us know by sending an email with this error to forge@redhat.com.\n'+err);
		});
		return request;
	} 
	this.fetchAddons = function(_success) { 
		return this.fetch('/api/addons', _success);
	}
	this.fetchAddonById = function(addonId, _success) { 
		return this.fetch('/api/addons/'+addonId, _success);
	}
	this.fetchAddonDocsById = function(addonId, _success) { 
		return this.fetch('/api/addons/'+addonId+'/docs', _success);
	}
	this.fetchAddonDocContentsById = function(addonId, docId, _success) { 
		return this.fetch('/api/addons/'+addonId+'/docs/'+docId, _success);
	}
	this.fetchContributors = function(_success) { 
		return this.fetch('/api/contributors', _success);
	}
	this.fetchDocs = function(_success) { 
		return this.fetch('/api/docs', _success);
	}
	this.fetchDocById = function(docsId, _success) { 
		return this.fetch('/api/docs/'+docsId, _success);
	}
	this.fetchDocContents = function(newsId, _success) { 
		return this.fetch('/api/docs/' + newsId + '/contents', _success);
	}	
	this.fetchDocToc = function(docId, _success) { 
		return this.fetch('/api/docs/' + docId + '/toc', _success);
	}	
	this.fetchMetadata = function(_success) { 
		return this.fetch('/api/metadata', _success);
	}
	this.fetchNews = function(_success) { 
		return this.fetch('/api/news', _success);
	}
	this.fetchNewsById = function(newsId, _success) { 
		return this.fetch('/api/news/'+newsId, _success);
	}
	this.fetchNewsContents = function(newsId, _success) { 
		return this.fetch('/api/news/' + newsId + '/contents', _success);
	}	
	this.fetchNewsToc = function(newsId, _success) { 
		return this.fetch('/api/news/' + newsId + '/toc', _success);
	}	
});

