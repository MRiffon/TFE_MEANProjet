/**
 * Created by Michaël and Martin on 08-04-16.
 */

angular.module('profilCtrl', []).controller('profilController', function($scope, $location, profilData, Upload){

    $scope.user = {};
    $scope.userEdit = {};
    $scope.editStatus = false;

    getProfilData = function(){
        profilData.getProfil().then(function(response){
            $scope.user = response.data;
            $scope.urlImg = "./img/clients/avatar/" + $scope.user._id + ".jpg";
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
            profilData.updateProfil($scope.userEdit).then(function(response){
                var status = response.status;
                if(status === 200 && response.data.message === "Updated!"){
                    $scope.editOff();
                    getProfilData();
                }
                if(status === 200 && response.data.name !== "" && response.data.name === "MongoError"){
                    $scope.dataEditProfilInvalid = true;
                    $scope.msgError = "Username déjà utilisé !";
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
                $location.path('/dashboard/profil');
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