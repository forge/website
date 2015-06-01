//Add the necessary routes here
angular.module('jboss-forge', ['ui.router','routeStyles'])
.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }]
)
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode({ enabled: true, requireBase: true });  
  $urlRouterProvider.otherwise('/');
  // Set up the states
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    css: 'css/parallax-styles.css',
    controller: 'homeCtrl',
    title: 'Home'
  })
  .state('addons', {
    url: '/addons',
    templateUrl: 'views/addons.html',
    css: ['css/forge_addons.css', 'css/parallax-styles.css'],
    controller: 'addonCtrl',
    title: 'Addons'
  })
  .state('addon_detail',{
    url: '/addons/mobile/{addonId}',
    templateUrl: 'views/addon_phone_template.html',
    css: 'css/forge_addons.css',
    controller: 'addonCtrl'
  })
  .state('documentation', {
    url: '/documentation',
    templateUrl: 'views/documentation.html',
    css: 'css/forge_documentation.css',
    controller: 'docCtrl',
    title: 'Documentation'
  })
  .state('community', {
    url: '/community',
    templateUrl: 'views/community.html',
    css: ['css/forge_community.css','css/parallax-styles.css'],
    controller: 'communityCtrl',
    title: 'Community'
  })
  .state('news', {
    url: '/news',
    templateUrl: 'views/news.html',
    css: 'css/forge_news.css',
    controller: 'newsCtrl',
    title: 'News'
  })
  .state('news_detail', {
    url: '/news/{newsId}',
    templateUrl: 'views/news_page.html',
    css: 'css/forge_doc_pages.css',
    controller: 'newsCtrl'
  })
  .state('documentation_detail',{
    url: '/document/{docId}',
    templateUrl: 'views/documentation_page.html',
    css: 'css/forge_doc_pages.css',
    controller: 'docCtrl'
  })
  .state('download',{
    url: '/download',
    templateUrl: 'views/download.html',
    css: ['css/forge_community.css','css/parallax-styles.css'],
    controller: 'downloadCtrl',
    title: 'Download'
  })  
  .state('events',{
    url: '/events',
    templateUrl: 'views/events.html',
    title: 'Events'
  })  
});