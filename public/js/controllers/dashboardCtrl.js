/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('dashboardCtrl', []).controller('dashboardController', function($scope, $location, $http, userData){
    $scope.isLogged = userData.loggedIn();
    $scope.currentUser = userData.currentUser();
    $scope.urlImg = "./img/clients/avatar/" + $scope.currentUser._id + ".jpg";
    console.log($scope.urlImg);

    $scope.logout = function(){
        return $http.get('/api/logout').then(function(){
            userData.logout();
            $location.path('/');
        }, function(response){
            console.log(response);
        });
    };
});