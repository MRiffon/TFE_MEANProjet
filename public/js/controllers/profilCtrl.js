/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $window, $location, profilData, Upload, $sessionStorage){

    $scope.user = {};
    $scope.userEdit = {};
    $scope.editStatus = false;
    $scope.$storage = $sessionStorage;

    getProfilData = function(){
        profilData.getProfil().then(function(response){
            $scope.user = response.data;
            $scope.$storage.urlImg = "./img/clients/avatar/" + $scope.user._id + ".jpg";
            console.log($scope.urlImg);
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
        $scope.successImgUpload = false;
        $scope.failedImgUpload = false;
        $scope.displayUpload = false;
        $scope.msgError = "";

    };

    $scope.inputFileChange = function(){
        $scope.displayUpload = true;
    };

    $scope.saveEdit = function(isValid){
        if(isValid && $scope.userEdit.password === $scope.userEdit.confirmPassword){
            $scope.userEdit.location = 'profil';
            profilData.resetPassword($scope.userEdit).then(function(response){
                console.log($scope.userEdit);
                var status = response.status;
                if(status === 200 && response.data.message === "Reset !"){
                    $scope.userEdit.oldPassword = null;
                    $scope.userEdit.password = null;
                    $scope.userEdit.confirmPassword = null;
                    $scope.editOff();
                    getProfilData();
                } else if(status === 200 && response.data.message === "Mauvais ancien mot de passe !"){
                    $scope.dataEditProfilInvalid = true;
                    $scope.msgError = response.data.message;
                    $scope.userEdit.oldPassword = null;
                    $scope.userEdit.password = null;
                    $scope.userEdit.confirmPassword = null;
                }
            });
        } else {
            $scope.msgError = "Mot de passe différents !!";
        }
    };

    $scope.uploadImg = function(isValid){
        if(isValid){
            $scope.triggerUpload = true;
            uploadImage($scope.imgProfile);
        }
    };

    uploadImage = function(file){
        var splitFileName = file.name.split(".");
        var fileExtension = "jpg";
        renameImage(file, $scope.user._id + '.' + fileExtension);
        Upload.upload({
            url: '/api/upload',
            data:{file: file}
        }).then(function(response){
            if(response.data.error_code === 0){
                $scope.successImgUpload = true;
                $scope.editStatus = false;
                $window.location.reload();
            } else {
                console.log("Error uplaod : " + response.data.err_desc);
                $scope.failedImgUpload = true;
            }
        }, function(response){
            console.log("Error status : " + response.status);
        }, function(evt){
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressUpload = "Progression : " + progressPercentage + "%";
        });
    };

    renameImage = function(file, name){
        file.ngfName = name;
        return file;
    };
});