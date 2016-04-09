/**
 * Created by Michaël on 08-04-16.
 */

angular.module('appRun', []).run(function($rootScope, $location, log){
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
        if($location.path() === '/profil' && !log.loggedIn()){
            $location.path('/');
        }
    });
});

