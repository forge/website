//Add the necessary routes here
angular.module('jboss-forge', ['ui.router','routeStyles'])

.config(function($stateProvider, $urlRouterProvider){
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('addons', {
      url: "/addons",
      templateUrl: "views/addons.html",
      css: 'css/forge_addons.css'
    })
    .state('addon_detail',{
      url: '/addons/mobile/{addonId}',
      templateUrl: 'views/addon_phone_template.html',
      css: 'css/forge_addons.css'
    })
    .state('documentation', {
      url: "/documentation",
      templateUrl: "views/documentation.html",
      css: 'css/forge_documentation.css'
    })
    .state('community', {
      url: "/community",
      templateUrl: "views/community.html",
      css: 'css/forge_community.css'
    })
    .state('news', {
      url: "/news",
      templateUrl: "views/news.html",
      css: 'css/forge_news.css'
    })
    .state('news_detail', {
      url: "/news/{newsId}",
      templateUrl: 'views/news_page.html',
      css: 'css/forge_doc_pages.css'      
    })
    .state('documentation_detail',{
      url: "/documentation/{docId}",
      templateUrl: 'views/documentation_page.html',
      css: 'css/forge_doc_pages.css'
    })
    ;
});