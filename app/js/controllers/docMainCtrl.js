angular.module('jboss-forge').controller('docDivHeightCtrl',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        setTimeout(function(){
            initDocumentationJS();
        },500);
    });
});
