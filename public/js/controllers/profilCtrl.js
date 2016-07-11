/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $location, profilData){

    $scope.user = {};
    $scope.userEdit = {};
    $scope.editStatus = false;

    getProfilData = function(){
        profilData.getProfil().then(function(response){
            $scope.user = response.data;
        }, function(response){
            $location.path('/');
        });
    };

    getProfilData();

    $scope.editOn = function(){
        $scope.editStatus = true;
    };

    $scope.editOff = function(){
        $scope.editStatus = false;

    };

    $scope.saveEdit = function(isValid){
        if(isValid && $scope.userEdit.password === $scope.userEdit.confirmPassword){
            profilData.updateProfil($scope.userEdit).then(function(response){
                console.log("Response du serveur : " + response.data.message);
                var status = response.status;

                if(status === 200 && response.data.message === "Updated!"){
                    $scope.editOff();
                    getProfilData();
                }
                if(status === 200 && response.data.name !== "" && response.data.name === "MongoError"){
                    $scope.dataEditProfilInvalid = true;
                    $scope.msgError = "Impossible de mettre à jour dû à l'utilisation du username par un autre utilisateur";
                    $scope.userEdit.password = null;
                    $scope.userEdit.confirmPassword = null;
                }
            });
        } else {
            $scope.msgError = "Mot de passe différents !!";
        }
    };
});