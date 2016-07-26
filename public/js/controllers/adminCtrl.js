/**
 * Created by micka on 18-07-16.
 */

angular.module('adminCtrl', []).controller('adminController', function($scope, adminData, $uibModal) {
    var users = [];
    $scope.selectedDepartments = [];
    $scope.selectedStatus = [];

    $scope.searchOptions = ['Username', 'Statut', 'Département'];
    $scope.typeSearch = 'Username';
    $scope.infosToSearch = '';
    $scope.searchUsername = true;

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
            console.log($scope.selectedDepartments);
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
            } else if($scope.searchStatus){
                infos.type = 'Status';
                infos.infosToSearch = $scope.infosToSearch.name;
            } else {
                infos.type = 'Username';
                infos.infosToSearch = $scope.infosToSearch;
            }


            console.log(infos);

            adminData.searchedUsers(infos).then(function(response){
                console.log(response);
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

    // Gestion de la pagination
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
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