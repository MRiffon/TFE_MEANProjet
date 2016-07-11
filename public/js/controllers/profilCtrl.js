/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $location, profilData){

    $scope.user = {};
    $scope.userEdit = {};
    $scope.editStatus = false;

    profilData.getProfil().then(function(response){
        $scope.user = response.data;
    }, function(response){
        $location.path('/');
    });

    $scope.editOn = function(){
        $scope.editStatus = true;
    };

    $scope.editOff = function(){
        $scope.editStatus = false;

    };

    $scope.saveEdit = function(isValid){
        console.log($scope.userEdit);
        if(isValid && $scope.userEdit.password == $scope.userEdit.confirmPassword){
            /*profilData.updateProfil($scope.userEdit).then(function(response){
                var status = response.status;
                var msgError = response.data.message;
                if(status === 200){
                    $scope.editOff();
                }
                if(status === 401){
                    $scope.dataEditProfilInvalid = true;
                    $scope.msgError = msgError;
                    $scope.userEdit.password = null;
                    $scope.userEdit.confirmPassword = null;
                }
            });*/
        }
    };

});