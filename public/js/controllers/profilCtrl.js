/**
 * Created by Michaël on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $location, dataFetch){

    $scope.user = {};

    dataFetch.getProfil().then(function(response){
        console.log(response);
        $scope.user = response.data;
    }, function(response){
        $location.path('/');
        console.log(response);
    })
});