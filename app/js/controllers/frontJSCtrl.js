// This control uses the JS in the js/lib/forge.frontpage.jquery.js script to:
// – Controls the network display
// – Controls the alignment in the front "Works in the environment you use" section
angular.module('jboss-forge').controller('frontPgCols',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        initFrontPageColSet();
    });
});


angular.module('jboss-forge').controller('frontPgNetwork',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        initFrontPageNetwork();
    });
});