/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('dashboardCtrl', []).controller('dashboardController', function($scope, $location, $http, log){
    $scope.isLogged = log.loggedIn();
    $scope.currentUser = log.currentUser();

    $scope.logout = function(){
        return $http.get('/api/logout').then(function(){
            log.logout();
            $location.path('/');
        }, function(response){
            console.log(response);
        });
    };
});