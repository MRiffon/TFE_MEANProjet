/**
 * Created by Michaël on 06-04-16.
 */

angular.module('navigationCtrl', []).controller('navigationController', function($scope, $location, $http, log){
    $scope.isLogged = log.loggedIn();
    $scope.currentUser = log.currentUser();

    $scope.logout = function(){
        return $http.get('/api/logout').then(function(){
            log.logout();
            $location.path('/');
        });
    }
});