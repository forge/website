// This control uses the JS in the js/lib/forge.news.jquery.js script to:
// – Controls the heights of the two main columns on the news page to make them even.

angular.module('jboss-forge').controller('newsJSCtrl',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        setTimeout('initNews()',500);
    });
});
