/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $location, profilData){

    $scope.user = {};

    profilData.getProfil().then(function(response){
        $scope.user = response.data;
    }, function(response){
        $location.path('/');
    });
});