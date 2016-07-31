/**
 * Created by micka on 22-07-16.
 */

angular.module('addGroupModalCtrl', []).controller('modalAddGroupController', function (Socket, $scope, $uibModalInstance, items, $sessionStorage, chatData) {
    $scope.title ='Créer un groupe';

    $scope.addGroup = {
        name: '',
        users : []
    };
    $scope.dataInvalid = false;

    $scope.items = items;
    $scope.items.users.splice($scope.items.users.indexOf($sessionStorage.user.username), 1);

    $scope.addUserToGroup = function(user){
        if($scope.addGroup.users.indexOf(user) === -1){
            $scope.addGroup.users.push(user);
            $scope.items.users.splice($scope.items.users.indexOf(user), 1);
        }
    };

    $scope.removeUserFromGroup = function(user){
        $scope.addGroup.users.splice($scope.addGroup.users.indexOf(user), 1);
        $scope.items.users.push(user);
    };
    
    $scope.saveGroup = function(isValid){
        $scope.submitted = true;
        if(isValid && $scope.addGroup.users.length >= 2){
            console.log('OK');
            $scope.addGroup.users.push($sessionStorage.user.username);
            var newRoom = {
                name : $scope.addGroup.name,
                type : 'Group',
                created : new Date()
            };
            chatData.createNewRoom(newRoom).then(function(response){
                //$scope.items.groupChatRooms.push(response.data);
                //$scope.items.currentUserRooms.push(response.data.name);
                chatData.updateUsersRoom({
                    users : $scope.addGroup.users,
                    chatRoom: newRoom.name,
                    action : 'add'
                });

                Socket.emit('notif-newRoom', {
                    users : $scope.addGroup.users,
                    chatRoom: response.data,
                    typeRoom : 'Group'
                });

            });

            $uibModalInstance.close();
        } else {
            $scope.msgError = 'Minimum deux utilisateurs requis !';
            $scope.dataInvalid = true;
        }
    };
});
