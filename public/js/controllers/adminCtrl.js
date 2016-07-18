/**
 * Created by micka on 18-07-16.
 */

angular.module('adminCtrl', []).controller('adminController', function($scope, adminData) {
    $scope.users = [];

    adminData.allUsers().then(function(response){
        $scope.users = response.data;
    }, function(response){
        console.log(response);
    });
});