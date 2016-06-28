/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('appRun', []).run(function($rootScope, $location, userData){
    $rootScope.$on('$locationChangeSuccess', function(){
        if(!userData.loggedIn()){
            $rootScope.$evalAsync(function() {
                $location.path('/');
            });
        }
    });
});

