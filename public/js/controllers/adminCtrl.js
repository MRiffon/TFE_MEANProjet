/**
 * Created by micka on 18-07-16.
 */

angular.module('adminCtrl', []).controller('adminController', function($scope, adminData, $uibModal, $parse) {
    $scope.selectedDepartments = [];
    $scope.selectedStatus = [];

    $scope.searchOptions = ['Username', 'Statut', 'Département'];
    $scope.typeSearch = 'Username';
    $scope.infosToSearch = '';
    $scope.searchUsername = true;

    $scope.filename = 'all_users';
    $scope.separator = ',';
    $scope.decimalSeparator = '.';

    $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: true,
        result: null,
        encoding: 'ISO-8859-1',
        encodingVisible: true,
    };

    fillInSelectDepartments = function(users, departments){
        $scope.selectedDepartments = [];
        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < departments.length; j++){
                if(users[i].department === departments[j].name){
                    $scope.selectedDepartments[i] = departments[j];
                }
            }
        }
    };

    fillInSelectStatus = function(users, status){
        $scope.selectedStatus = [];
        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < status.length; j++){
                if(users[i].status === status[j].name){
                    $scope.selectedStatus[i] = status[j];
                }
            }
        }
    };

    // Chargement des infos pour lister les users
    adminData.allUsers().then(function(response){
        $scope.users = response.data;
        $scope.totalUsers = $scope.users.length;

        adminData.allDepartments().then(function(response){
            $scope.departments = response.data;
            fillInSelectDepartments($scope.users, $scope.departments);
        }, function(response){
            console.log(response);
        });

        adminData.allStatus().then(function(response){
            $scope.status = response.data;
            fillInSelectStatus($scope.users, $scope.status);
        }, function(response){
            console.log(response);
        });

    }, function(response){
        console.log(response);
    });

    // Gestion de l'update du status ou département
    $scope.updateUser = function(user, type, toUpdate){
        if(type === 'department'){
            user.department = toUpdate.name;
        } else if(type === 'status'){
            user.status = toUpdate.name;
        }

        adminData.updateUser(user).then(function(response){
            adminData.allUsers().then(function(response){
                $scope.users = response.data;
                alert('Informations bien mises à jour !');
            });
        });
    };

    // Suppression d'un user avec confirmation
    $scope.deleteUser = function(user){
        adminData.deleteUser(user);
        alert(user.username + ' a bien été supprimé !');
    };

    // Effectuer une recherche
    $scope.searchResults = function(isValid){
        $scope.submitted = true;
        if(isValid){
            var infos = {
                type : '',
                infosToSearch : ''
            };
            if($scope.searchDepartment){
                infos.type = 'Department';
                infos.infosToSearch = $scope.infosToSearch.name;
                $scope.filename = 'all_users';
            } else if($scope.searchStatus){
                infos.type = 'Status';
                infos.infosToSearch = $scope.infosToSearch.name;
            } else {
                infos.type = 'Username';
                infos.infosToSearch = $scope.infosToSearch;
            }

            $scope.filename = infos.infosToSearch + '_users';

            adminData.searchedUsers(infos).then(function(response){
                $scope.users = response.data;
                fillInSelectDepartments($scope.users, $scope.departments);
                fillInSelectStatus($scope.users, $scope.status);
            });
        }
    };

    $scope.changeTypeSearch = function(typeSearch){
        $scope.submitted = false;
        $scope.searchDepartment = false;
        $scope.searchUsername = false;
        $scope.searchStatus = false;
        if(typeSearch === 'Statut'){
            $scope.searchStatus = true;
        } else if(typeSearch === 'Département'){
            $scope.searchDepartment = true;
        } else $scope.searchUsername = true;
    };

    $scope.getHeader = function(){
        return ['Username', 'Email', 'Statut', 'Département'];
    };

    $scope.getUsers = function(){
        var arrayUsers = [];
        var tempUser = {
            username: '',
            email: '',
            status: '',
            department: ''
        };
        for(var i = 0; i < $scope.users.length; i++){
            tempUser.username = $scope.users[i].username;
            tempUser.email = $scope.users[i].email;
            tempUser.status = $scope.users[i].status;
            tempUser.department = $scope.users[i].department;

            arrayUsers[i] = tempUser;
            tempUser = {};
        }

        return arrayUsers;
    };

    // parse contenu csv vers json et enregistrement des users
    $scope.createUsersFromCsv = function (json) {

        console.log('fonction de parse trigger');
        var objStr = JSON.stringify(json);
        var obj = null;
        try {
            obj = $parse(objStr)({});
        } catch(e){
            // eat $parse error
            return _lastGoodResult;
        }
        
        var usersToAdd = obj;
        for(var i = 0; i < usersToAdd.length; i++){
            usersToAdd[i].chatRooms = ['Global'];
            usersToAdd[i].password = '';
        }

        adminData.createUser(usersToAdd).then(function(response){
            var msg = response.data.message;
            if(msg === 'Created!'){
                alert('Utilisateur(s) créé(s)');
            } else {
                alert("Une erreur s'est produite !");
            }
        });
    };

    // Gestion de la modal pour la création d'un user
    $scope.animationsEnabled = true;
    $scope.open = function (size) {

        $scope.items = {};

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../views/modals/addUserModalView.html',
            controller: 'modalAddUserController',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };
});