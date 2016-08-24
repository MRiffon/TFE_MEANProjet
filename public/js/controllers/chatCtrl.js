/**
 * Created by Michaël and Martin on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData, $sessionStorage, $uibModal, notificationData, adminData){

    console.log('USER : ' + $sessionStorage.user.chatRooms);
    
    $scope.showGlobal = true;
    $scope.showGroups = false;
    $scope.showUsers = false;
    
    $scope.conversGlobal = "Global";
    $scope.conversGroup = "Group";
    $scope.conversUsers = "Users";
    
    $scope.changeTypeConvers = function(type){
        if(type === 'Group'){
            $scope.showGroups = true;
            $scope.showGlobal = false;
            $scope.showUsers = false;
        } else if(type === 'Users'){
            $scope.showUsers = true;
            $scope.showGroups = false;
            $scope.showGlobal = false;
        } else {
            $scope.showGlobal = true;
            $scope.showGroups = false;
            $scope.showUsers = false;
        }
    };

    var tempRoom = {};
    $scope.selectedRoom = {};
    $scope.$storage = $sessionStorage;
    $scope.chatRoomName = '';

    $scope.userRooms = {};

    $scope.disconnectedUsersName = [];
    $scope.allUsersName = [];

    $scope.users = [];
    $scope.messages = [];

    var username = $sessionStorage.user.username;

    adminData.allUsers().then(function(response) {
        var allUsers = response.data;
        for(var i = 0; i < allUsers.length; i++){
            $scope.disconnectedUsersName.push(allUsers[i].username);
            $scope.allUsersName.push(allUsers[i].username);
        }
    });

    chatData.userRooms().then(function(response){
        $scope.userRooms = response;
        if($sessionStorage.currentChatRoom === undefined){
            $scope.$storage = $sessionStorage.$default({
                currentChatRoom: $scope.userRooms.globalRooms[0]
            });
        }

        $scope.selectedRoom = $scope.$storage.currentChatRoom;
        $scope.chatRoomName = getRoomName($scope.selectedRoom);
        tempRoom = $scope.selectedRoom;

        Socket.emit('new user', {
            username: username,
            defaultChatRoom: $scope.selectedRoom
        });
        getLastMessage();
    });

    $scope.isGroupChatRoom = function(selectedRoom){

        if ($scope.userRooms.groupRooms !== undefined && $scope.userRooms.groupRooms.length > 0){
            for (var i = 0; i < $scope.userRooms.groupRooms.length; i++){
                if($scope.userRooms.groupRooms[i].name === selectedRoom){
                    return true;
                }
            }
            return false;

        }else{
            return false;
        }

    };

    $scope.leaveGroup = function(chatRoomName){

        chatData.updateUsersRoom({
            users : [
                userData.currentUser().username
            ],
            chatRoom: chatRoomName,
            action: 'remove'
        });

        $scope.$storage.user.chatRooms.splice($scope.$storage.user.chatRooms.indexOf(chatRoomName), 1);
        $scope.userRooms.groupRooms.splice($scope.userRooms.groupRooms.indexOf(chatRoomName), 1);
        $scope.switchRoom($scope.$storage.user.chatRooms[0]);
    };

    $scope.switchRoom = function(room){
        $scope.selectedRoom = room;
        $scope.chatRoomName = getRoomName($scope.selectedRoom);
        $scope.$storage.currentChatRoom = $scope.selectedRoom;
        Socket.emit('switch room', {
            oldChatRoom: tempRoom.name,
            newChatRoom: $scope.selectedRoom.name,
            username: username
        });
        getLastMessage();
        tempRoom = $scope.selectedRoom;
    };
    
    $scope.getPrivateRoom = function(user){
        console.log($scope.userRooms.privateRooms.length);
        for(var i = 0; i < $scope.userRooms.privateRooms.length; i++){
            var temp = $scope.userRooms.privateRooms[i].name.split('_');
            if(temp.indexOf(user) !== -1){
                console.log("index trouvé, on vérifie la selectedRoom et on switche si besoin");
                if($scope.userRooms.privateRooms[i].name !== $scope.selectedRoom.name){
                    $scope.switchRoom($scope.userRooms.privateRooms[i]);
                }
                return;
            }
        }
        console.log('Pas de switch , on crée une room !!');
        var newRoom = {
            name : userData.currentUser().username + '_' + user,
            type : 'Private',
            created : new Date()
        };
        console.log("newRoom qui va être créée : " + newRoom);
        chatData.createNewRoom(newRoom).then(function(response){
            //$scope.userRooms.privateRooms.push(response.data);
            //$scope.$storage.user.chatRooms.push(response.data.name);
            chatData.updateUsersRoom({
                users : [
                    userData.currentUser().username,
                    user
                ],
                chatRoom: newRoom.name,
                action : 'add'
            });

            Socket.emit('notif-newRoom', {
                users: [
                    userData.currentUser().username,
                    user
                ],
                chatRoom: response.data,
                typeRoom : 'Private'
            });

            $scope.switchRoom(newRoom);
        });
    };

    $scope.sendMessage = function(msg){
        console.log(msg);
        var message = {
            message: msg,
            room: $scope.selectedRoom.name,
            sender: username
        };
        //$scope.messages.push(msg);
        if(message.message !== null && message.message !== '' && message.message !== undefined){
            Socket.emit('message sended', message);

            var usersConcerned = [];

            var infos = {
                type : 'ChatRoom',
                infosToSearch : $scope.selectedRoom.name
            };

            adminData.searchedUsers(infos).then(function(response){
                usersConcerned = response.data;
                console.log(usersConcerned);

                var content = 'Vous avez reçu un nouveau message';
                if($scope.selectedRoom.type === 'Global' || $scope.selectedRoom.type === 'Group'){
                    content += ' dans le chatroom ' + $scope.selectedRoom.name;
                }
                content += ' de ' + username;
                console.log(content);
                
                for(var i = 0; i < usersConcerned.length; i++){
                    if(usersConcerned[i].username === username){
                        usersConcerned.splice(i, 1);
                    }
                }
                
                var addNotif = {
                    users : usersConcerned,
                    identifier : 'Chat',
                    content : content
                };
                notificationData.createNotification(addNotif).then(function(response){
                    var usernameToNotif = [];
                    for(var i = 0; i < usersConcerned.length; i++){
                        usernameToNotif.push(usersConcerned[i].username);
                    }
                    var notifMessage = {
                        users : usernameToNotif,
                        sender : username,
                        message : content,
                        identifier : 'Chat'
                    };
                    Socket.emit('notif-newMessage', notifMessage);
                });
            });
        }
        $scope.msg = '';
    };

    $scope.isUrself = function(username){
        if(username !== undefined){
            return $sessionStorage.user.username !== username;
        }
    };
    
    $scope.animationsEnabled = true;
    $scope.open = function (size) {

        $scope.items = {
            users : Object.create($scope.allUsersName),
            groupChatRooms : $scope.userRooms.groupRooms,
            currentUserRooms : $scope.$storage.user.chatRooms,
            room : ''
        };

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../views/modals/addGroupModalView.html',
            controller: 'modalAddGroupController',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            $scope.switchRoom($scope.items.room);
        });
    };
    
    // Fonctions internes
    getLastMessage = function(){
        chatData.lastMessages($scope.$storage.currentChatRoom).then(function(response){
            $scope.messages = '';
            $scope.messages = response.data;
        });
    };

    /**
     * Cette function permet de récupérer le nom de l'utilisateur à qui l'on veut parler pour l'afficher dans
     * l'entête de la conversation.
     */
    getRoomName = function(room){
        if(room.type === 'Private'){
            var temp = room.name.split('_');
            for(var i = 0; i < temp.length; i++){
                if(temp[i] !== $sessionStorage.user.username) {
                    return temp[i];
                }
            }
        } else {
            return room.name;
        }
    };

    // Socket events
    Socket.on('newRoom', function(data){
        console.log("emit newRoom received");
        if(data.typeRoom === 'Private'){
            $scope.userRooms.privateRooms.push(data.chatRoom);
            console.log("socket on newRoom : private room added : ", data.chatRoom);
        } else if(data.typeRoom === 'Group') {
            console.log(data.chatRoom);
            console.log("socket on newRoom : group room added : ", data.chatRoom);
            $scope.userRooms.groupRooms.push(data.chatRoom);
        }
        if($scope.$storage.user.chatRooms.indexOf(data.chatRoom.name) == -1){
            $scope.$storage.user.chatRooms.push(data.chatRoom.name);
            console.log("Rooms dans $storage : " + $scope.$storage.user.chatRooms);
        }

    });

    Socket.on('message dispatched', function(data){
        console.log("Message renvoyé par le serveur: " + data.content);
        $scope.messages.push(data);
        $scope.message = "";
    });

    Socket.on('userConnected', function(data){
        $scope.users.push(data.username);
        console.log('New Users connected : ' + $scope.users);
    });

    Socket.on('userDisconnected', function(data){
        $scope.users.splice($scope.users.indexOf(data.username), 1);
        console.log('Users after disconnected : ' + $scope.users);
    });

    Socket.emit('requestUsers', {});

    Socket.on('listUsers', function(data){
        $scope.users = data.users;
        console.log('Liste des users : ' + $scope.users);

        for(var j = 0; j < $scope.users.length; j++){
            $scope.disconnectedUsersName.splice($scope.disconnectedUsersName.indexOf($scope.users[j]), 1);
        }
        console.log($scope.disconnectedUsersName);
    });

    Socket.on('user joined default',function(data){
        console.log(data.username + " has joined " + data.defaultChatRoom.name);
    });

    Socket.on('user has joined',function(data){
        console.log(data.username + " has joined " + data.newChatRoom);
    });
    Socket.on('user has left',function(data){
        console.log(data.username + " has left " + data.oldChatRoom);
    });
});
