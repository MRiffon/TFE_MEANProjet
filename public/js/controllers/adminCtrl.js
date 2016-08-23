/**
 * Created by micka on 18-07-16.
 */

angular.module('adminCtrl', []).controller('adminController', function($scope, adminData, $uibModal, $parse, $http) {
    $scope.selectedDepartments = [];
    $scope.selectedStatus = [];
    $scope.departments = [];
    $scope.status = [];

    $scope.searchOptions = ['Username', 'Statut', 'Département'];
    $scope.typeSearch = 'Username';
    $scope.infosToSearch = '';
    $scope.searchUsername = true;
    $scope.isSearched = false;

    $scope.filename = 'all_users';
    $scope.separator = ',';
    $scope.decimalSeparator = '.';

    $scope.isAdmin = function(user){
        if(user.role === 'Admin'){
            return true;
        } else return false;
    };

    $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: true,
        result: null,
        encoding: 'ISO-8859-1',
        encodingVisible: true
    };

    // on remplit le tableau contenant les départmenents liés aux utilisateurs
    fillInSelectDepartments = function(users, departments){
        $scope.selectedDepartments = [];
        console.log(users.length);
        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < departments.length; j++){
                if(users[i].department === departments[j]){
                    $scope.selectedDepartments[i] = departments[j];
                }
            }
        }
    };

    // idem pour les statuts
    fillInSelectStatus = function(users, status){
        $scope.selectedStatus = [];
        console.log(users.length);
        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < status.length; j++){
                if(users[i].status === status[j]){
                    $scope.selectedStatus[i] = status[j];
                    console.log($scope.selectedStatus[i]);
                }
            }
        }
    };
    
    // Chargement des infos pour lister les users
    $scope.listUsers = function(){
        $scope.isSearched = false;
        adminData.allUsers().then(function(response){
            $scope.users = response.data;
            console.log($scope.users);
            $scope.totalUsers = $scope.users.length;

            adminData.allDepartments().then(function(response){
                var departments = response.data;
                for(var i = 0; i < departments.length; i++){
                    $scope.departments[i] = departments[i].name;
                }
                fillInSelectDepartments($scope.users, $scope.departments);
            }, function(response){
                console.log(response);
            });

            adminData.allStatus().then(function(response){
                var status = response.data;
                for(var i = 0; i < status.length; i++){
                    $scope.status[i] = status[i].name;
                }
                fillInSelectStatus($scope.users, $scope.status);
            }, function(response){
                console.log(response);
            });

        }, function(response){
            console.log(response);
        });
    };

    $scope.listUsers();
    
    // Gestion de l'update du status ou département
    $scope.updateUser = function(user, type, toUpdate){
        var message = '';
        user.location = 'admin';
        if(type === 'department'){
            user.department = toUpdate;
            user.chatRooms.splice(1, 1);
            user.chatRooms.push(toUpdate);
            message = 'Votre département a été changé ! Vous faites dorénavant partie du département ' + toUpdate;
        } else if(type === 'status'){
            user.status = toUpdate;
            message = 'Votre statut sur le site a changé ! Vous êtes maintenant ' + toUpdate;
        } else if(type === 'password'){
            console.log('On change le password');
            var tabSpecialChar = ['@', '#', '~', '%', '!', '?', '$'];

            var randNumber = Math.floor((Math.random() + 1) * 10000);
            var password = 'Pass' + randNumber + tabSpecialChar[Math.floor(Math.random() * 7)];

            message = 'Votre mot de passe a été réinitialisé. Voici votre nouveau (à vite changer): ' + password;

            user.password = password;
        }

        adminData.updateUser(user).then(function(response){
            console.log(response);
            if(response.data.message === 'Updated!'){
                $http.get('/api/sendEmail', { params: {
                    to: user.email,
                    subject: 'Mise à jour de votre compte utilisateur',
                    text: message
                }});

                adminData.allUsers().then(function(response){
                    $scope.users = response.data;
                    alert('Informations bien mises à jour !');
                });
            }
        });
    };

    // Suppression d'un user avec confirmation
    $scope.deleteUser = function(user){
        adminData.deleteUser(user);
        console.log(user.username);
        $scope.users.splice($scope.users.indexOf(user), 1);
    };


    // recherche d'un utilisateur selon différents critères
    $scope.searchResults = function(){
        $scope.isSearched = true;
        var infos = {
            type : '',
            infosToSearch : ''
        };
        infos.infosToSearch = $scope.infosToSearch;
        if($scope.searchDepartment){
            infos.type = 'Department';
        } else if($scope.searchStatus){
            infos.type = 'Status';
        } else infos.type = 'Username';

        $scope.filename = infos.infosToSearch + '_users';

        adminData.searchedUsers(infos).then(function(response){
            $scope.users = response.data;
            fillInSelectDepartments($scope.users, $scope.departments);
            fillInSelectStatus($scope.users, $scope.status);
        });
    };

    // Changement du type en fonction de la valeur du premier select
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
        return ['Username', 'Email', 'Prénom', 'Nom', 'Département'];
    };

    // on récupère les utilisateurs sous tableau pour remplir le fichier csv
    $scope.getUsers = function(){
        var arrayUsers = [];
        var tempUser = {
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            department: ''
        };
        for(var i = 0; i < $scope.users.length; i++){
            tempUser.username = $scope.users[i].username;
            tempUser.email = $scope.users[i].email;
            tempUser.firstname = $scope.users[i].firstname;
            tempUser.lastname = $scope.users[i].lastname;
            tempUser.department = $scope.users[i].department;

            arrayUsers[i] = tempUser;
            tempUser = {};
        }

        return arrayUsers;
    };

    // parse contenu csv vers json et enregistrement des users en bdd
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
            usersToAdd[i].chatRooms = ['General', usersToAdd[i].department];
            usersToAdd[i].password = '';
        }

        adminData.createUser(usersToAdd).then(function(response){
            var msg = response.data.message;
            if(msg === 'Created!'){
                alert('Utilisateur(s) créé(s)');
                for(var i = 0; i < usersToAdd.length; i++){
                    usersToAdd[i].status = 'Active';
                    $scope.users.push(usersToAdd[i]);
                    fillInSelectDepartments($scope.users, $scope.departments);
                    fillInSelectStatus($scope.users, $scope.status);
                }
            } else {
                alert("Une erreur s'est produite !");
            }
        });
    };

    // Gestion de la modal pour la création d'un user
    $scope.animationsEnabled = true;
    $scope.items = {
        user : {},
        status : ''
    };
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

        modalInstance.result.then(function () {
            if($scope.items.status === 'userAdded'){
                $scope.items.user.status = 'Active';
                $scope.users.push($scope.items.user);
                fillInSelectDepartments($scope.users, $scope.departments);
                fillInSelectStatus($scope.users, $scope.status);
            }
        });
    };
});