// This control uses the JS in the js/lib/forge.addons.jquery.js script to:
// – Controls the heights of the addons boxes
// - Sets star ratings


angular.module('jboss-forge').controller('addOnGridCtrl',function($scope) {
    $scope.$watch('$viewContentLoaded', function(){
        setTimeout('initAddonSet()',200);
    });
});
