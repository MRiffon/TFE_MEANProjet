/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('appRun', []).run(function($rootScope, $location, userData, $state){
    'use strict';
    $rootScope.$on('$locationChangeSuccess', function(event){
        if(!userData.loggedIn()){
            $rootScope.$evalAsync(function() {
                $location.path('/');
            });
        }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        event.preventDefault();
        if (error.redirectTo) {
            $state.go(error.redirectTo);
        } else {
            $state.go('error');
        }
    });
});

