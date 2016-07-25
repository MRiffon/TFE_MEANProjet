/**
 * Created by micka on 18-07-16.
 */

angular.module('adminCtrl', []).controller('adminController', function($scope, adminData, $uibModal) {
    var users = [];
    $scope.selectedDepartments = [];
    $scope.selectedStatus = [];

    adminData.allUsers().then(function(response){
        $scope.users = response.data;
        users = $scope.users;
    }, function(response){
        console.log(response);
    });

    adminData.allDepartments().then(function(response){
        $scope.departments = response.data;

        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < $scope.departments.length; j++){
                if(users[i].department === $scope.departments[j].name){
                    $scope.selectedDepartments[i] = $scope.departments[j];
                }
            }
        }
        console.log($scope.selectedDepartments);
    }, function(response){
        console.log(response);
    });

    adminData.allStatus().then(function(response){
        $scope.status = response.data;

        for(var i = 0; i < users.length; i++){
            for (var j = 0; j < $scope.status.length; j++){
                if(users[i].status === $scope.status[j].name){
                    $scope.selectedStatus[i] = $scope.status[j];
                }
            }
        }
    }, function(response){
        console.log(response);
    });

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

    $scope.deleteUser = function(user){
        adminData.deleteUser(user);
    };

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