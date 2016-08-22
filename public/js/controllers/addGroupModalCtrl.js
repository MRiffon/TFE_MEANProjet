/**
 * Created by micka on 22-07-16.
 */

angular.module('addGroupModalCtrl', []).controller('modalAddGroupController', function (Socket, $scope, $uibModalInstance, items, $sessionStorage, chatData, notificationData, adminData) {
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
            $scope.items.room = newRoom;
            chatData.createNewRoom(newRoom).then(function(response){
                var roomToNotif = response.data;
                //$scope.items.groupChatRooms.push(response.data);
                //$scope.items.currentUserRooms.push(response.data.name);
                chatData.updateUsersRoom({
                    users : $scope.addGroup.users,
                    chatRoom: newRoom.name,
                    action : 'add'
                });

                var infos = {
                    type : 'ChatRoom',
                    infosToSearch : $scope.addGroup.name
                };

                adminData.searchedUsers(infos).then(function(response){
                    var usersConcerned = response.data;
                    for(var i = 0; i < usersConcerned.length; i++){
                        if(usersConcerned[i].username === $sessionStorage.user.username){
                            usersConcerned.splice(i, 1);
                        }
                    }

                    var content = 'Vous avez été invité dans une nouvelle conversation de groupe : ' + $scope.addGroup.name;
                    var addGroupNotif = {
                        users : usersConcerned,
                        identifier : 'Chat',
                        content : content
                    };

                    console.log(addGroupNotif);

                    notificationData.createNotification(addGroupNotif).then(function(response){
                        Socket.emit('notif-newRoom', {
                         users : $scope.addGroup.users,
                         chatRoom:  roomToNotif,
                         typeRoom : 'Group',
                         message : content,
                         identifier : 'Chat'
                         });
                    });
                });

            });

            $uibModalInstance.close();
        } else {
            $scope.msgError = 'Minimum deux utilisateurs requis !';
            $scope.dataInvalid = true;
        }
    };
});
