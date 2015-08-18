// This control uses the JS in the js/lib/forge.community.jquery.js script to:
// – Control the vertical bar spacing in the "So many Ways to contribute" marque &
// - Create the img/link grid

angular.module('jboss-forge').controller('communityGridCtrl',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        setTimeout('initCommunity()',200);
    });
});
