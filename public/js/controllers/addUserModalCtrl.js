/**
 * Created by micka on 25-07-16.
 */

angular.module('addUserModalCtrl', []).controller('modalAddUserController', function ($scope, $uibModalInstance, items, adminData) {
    $scope.addUser = {
        username: '',
        email : '',
        department: '',
        chatRooms : ['Global'],
        password : ''
    };

    $scope.selectedDepartment = {};
    $scope.dataLoginInvalid = false;

    adminData.allDepartments().then(function(response){
        $scope.departments = response.data;
        console.log($scope.departments);
    }, function(response){
        console.log(response);
    });

    $scope.saveUser = function(isValid){
        $scope.submitted = true;
        if(isValid){
            $scope.addUser.department = $scope.selectedDepartment.name;
            adminData.createUser($scope.addUser).then(function(response){
                var msg = response.data.message;
                if(msg === 'Created!'){
                    $uibModalInstance.close();
                    alert('Utilisateur créé');
                } else {
                    console.log('Error');
                    $scope.dataLoginInvalid = true;
                    $scope.msgError = 'Duplication ! Informations redondantes en base de données.';
                }
            });
        }
    };
});