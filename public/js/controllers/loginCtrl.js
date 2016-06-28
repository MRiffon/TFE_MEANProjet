/**
 * Created by Michaël and Martin on 06-04-16.
 */

angular.module('loginCtrl', []).controller('loginController', function($scope, $location, userData){

    $scope.credentials = {
        email : "",
        password : ""
    };

    $scope.onSubmit = function(isValid){
        $scope.submitted = true;
        if(isValid){
            userData.login($scope.credentials).then(function(response){
                var status = response.status;
                var msgError = response.data.message;
                if(status === 200){
                    $location.path('/dashboard');
                }
                if(status === 401) {
                    $scope.dataLoginInvalid = true;
                    $scope.msgError = msgError;
                    $scope.credentials.password = null;
                }
            });
        }
    };
});