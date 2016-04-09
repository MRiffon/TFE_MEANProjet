/**
 * Created by Michaël on 06-04-16.
 */

angular.module('navigationCtrl', []).controller('navigationController', function($scope, $location, log){
    $scope.isLogged = log.loggedIn();
    $scope.currentUser = log.currentUser();
});