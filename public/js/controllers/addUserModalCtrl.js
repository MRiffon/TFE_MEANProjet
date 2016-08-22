/**
 * Created by micka on 25-07-16.
 */

angular.module('addUserModalCtrl', []).controller('modalAddUserController', function ($scope, $uibModalInstance, items, adminData, $http) {
    $scope.addUser = {
        username: '',
        email : '',
        department: '',
        chatRooms : [],
        lastname: '',
        firstname: '',
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
            var randNumber = Math.floor(Math.random() * 10000);
            var password = 'Pass' + randNumber;

            $scope.addUser.department = $scope.selectedDepartment.name;
            var addUser = [];
            addUser.push($scope.addUser);
            addUser[0].chatRooms = ['General', $scope.selectedDepartment.name];
            addUser[0].password = password;
            console.log(addUser[0]);
            $scope.items.user = $scope.addUser;
            $scope.items.status = 'userAdded';
            adminData.createUser(addUser).then(function(response){
                
                var msg = response.data.message;
                if(msg === 'Created!'){
                    $http.get('/api/sendEmailNewUser', { params: {
                        to: addUser[0].email,
                        subject: 'Nouveau compte utilisateur',
                        text: 'Votre compte a été créé. Voici votre mot de passe de connexion (à changer dès que possible) : ' + password
                    }});

                    $uibModalInstance.close();
                    alert('Utilisateur créé');
                } else {
                    console.log('Error');
                    $scope.dataLoginInvalid = true;
                    $scope.msgError = "Tentative de duplication ! Username ou email déjà utilisé dans l'entreprise";
                }
            });
        }
    };
});