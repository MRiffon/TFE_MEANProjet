/**
 * Created by Michaël and Martin on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData, $sessionStorage){

    console.log('USER : ' + $sessionStorage.user.chatRooms);

    var tempRoom = {};
    $scope.selectedRoom = {};
    $scope.$storage = $sessionStorage;
    $scope.chatRoomName = '';
    $scope.allRooms = {};

    chatData.userRooms().then(function(response){
        console.log(response);
        $scope.allRooms = response;
        $scope.$storage = $sessionStorage.$default({
            currentChatRoom: $scope.allRooms.globalRooms[0]
        });
        console.log("currentChatRoom de merde : " + $scope.$storage.currentChatRoom);
        $scope.selectedRoom = $scope.$storage.currentChatRoom;
        $scope.chatRoomName = getRoomName($scope.selectedRoom);
        tempRoom = $scope.selectedRoom;

        Socket.emit('new user', {
            username: username,
            defaultChatRoom: $scope.selectedRoom
        });
        getLastMessage();
    });

    $scope.users = [];
    $scope.messages = [];

    $scope.currentUser = userData.currentUser();

    var username = $scope.currentUser.username;
    // new user enter in the name

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
        for(var i = 0; i < $scope.allRooms.privateRooms.length; i++){
            var temp = $scope.allRooms.privateRooms[i].name.split('_');
            if(temp.indexOf(user) !== -1){
                console.log("index trouvé, ca switch direct");
                $scope.switchRoom($scope.allRooms.privateRooms[i]);
                return;
            }
        }
        console.log('Pas de switch direct, on crée une room !!');
        var newRoom = {
            name : userData.currentUser().username + '_' + user,
            type : 'Private',
            created : new Date()
        };

        chatData.createPrivateRoom(newRoom).then(function(response){
            $scope.allRooms.privateRooms.push(response.data);
            $scope.$storage.user.chatRooms.push(newRoom.name);
            chatData.updateRoomsUsers({
                users : [
                    userData.currentUser().username,
                    user
                ],
                chatRoom: newRoom.name
            });

            Socket.emit('notif-newRoom', {
                username: user,
                chatRoom: response.data
            });

            $scope.switchRoom(newRoom);
        });
    };

    $scope.sendMessage = function(msg){
        var message = {
            message: msg,
            room: $scope.selectedRoom.name,
            sender: username
        };
        //$scope.messages.push(msg);
        if(msg !== null && msg !== ''){
            Socket.emit('message sended', message);
        }
        $scope.msg = '';
    };

    $scope.isUrself = function(username){
        if(userData.currentUser().username !== username){
            return true;
        } return false;
    };

    // Fonctions internes
    getLastMessage = function(){
        chatData.lastMessages($scope.$storage.currentChatRoom).then(function(response){
            $scope.messages = '';
            $scope.messages = response.data;
        });
    };

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
        console.log('newRoom Socket clientside : ' + data);
        $scope.allRooms.privateRooms.push(data);
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
    });

    Socket.on('user joined default',function(data){
        console.log("user has joined default : " + data.username + ' + ' + data.defaultChatRoom.name);
    });

    Socket.on('user has joined',function(data){
        console.log("user has joined : " + data.username + ' + ' + data.newChatRoom);
    });
    Socket.on('user has left',function(data){
        console.log("user has left : " + data.username + ' + ' + data.oldChatRoom);
    });
});
