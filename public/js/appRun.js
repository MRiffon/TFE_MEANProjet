/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('appRun', []).run(function($rootScope, $location, log){
    $rootScope.$on('$locationChangeSuccess', function(){
        if(!log.loggedIn()){
            $rootScope.$evalAsync(function() {
                $location.path('/');
            });
        }
    });
});

