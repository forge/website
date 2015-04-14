//Add the necessary routes here
angular.module('jboss-forge', ['ngRoute','routeStyles'])

.config(function($routeProvider){
  $routeProvider

  .when('/addons',{
      templateUrl: 'views/addons.html',
      css: 'css/forge_addons.css'
  })
  
  .when('/documentation',{
      templateUrl: 'views/documentation.html',
      css: 'css/forge_documentation.css'
  })
  
  .when('/community',{
      controller: 'CommunityController',
      templateUrl: 'views/community.html',
      css: 'css/forge_community.css'
  })  

  .when('/news',{
      templateUrl: 'views/news.html',
      css: 'css/forge_news.css'
  })  

  .when('/news/:id',{
      templateUrl: 'views/news_page.html',
      css: 'css/forge_doc_pages.css'
  })  

  .when('/documentation/:id',{
      templateUrl: 'views/documentation_page.html',
      css: 'css/forge_doc_pages.css'
  })    

  .otherwise({
       templateUrl: 'views/home.html'
 })

});