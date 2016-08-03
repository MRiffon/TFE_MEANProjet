/**
 * Created by micka on 25-07-16.
 */

angular.module('addUserModalCtrl', []).controller('modalAddUserController', function ($scope, $uibModalInstance, items, adminData) {
    $scope.addUser = {
        username: '',
        email : '',
        department: '',
        chatRooms : [],
        password : ''
    };

    $scope.items = items;

    $scope.selectedDepartment = {};
    $scope.dataLoginInvalid = false;

    adminData.allDepartments().then(function(response){
        $scope.departments = response.data;
    }, function(response){
        console.log(response);
    });

    $scope.saveUser = function(isValid){
        $scope.submitted = true;
        if(isValid){
            $scope.addUser.department = $scope.selectedDepartment.name;
            var addUser = [];
            addUser.push($scope.addUser);
            addUser[0].chatRooms = ['Global', $scope.selectedDepartment.name];
            console.log(addUser[0]);
            $scope.items.user = $scope.addUser;
            $scope.items.status = 'userAdded';
            adminData.createUser(addUser).then(function(response){
                
                // ajouter le ticket à l'utilisateur !
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