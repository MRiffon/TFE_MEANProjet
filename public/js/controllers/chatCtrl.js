/**
 * Created by Michaël and Martin on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData, $sessionStorage){

    var tempRoom = {};
    $scope.selectedRoom = {};
    $scope.$storage = $sessionStorage;
    $scope.chatRoomName = '';
    $scope.allRooms = {};

    chatData.userRooms().then(function(response){
        console.log(response);
        $scope.allRooms = response;
        console.log("datarooms après remplissage : " + $scope.allRooms.globalRooms);
        $scope.$storage = $sessionStorage.$default({
            currentChatRoom: $scope.allRooms.globalRooms[0]
        });
        console.log("currentChatRoom de merde : " + $scope.$storage.currentChatRoom);
        $scope.selectedRoom = $scope.$storage.currentChatRoom;
        $scope.chatRoomName = $scope.selectedRoom.name;
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

    console.log($scope.currentUser.chatRooms);

    var username = $scope.currentUser.username;
    // new user enter in the name


    Socket.on('user joined default',function(data){
        console.log("user has joined default : " + data.username + ' + ' + data.defaultChatRoom.name);
    });

    Socket.on('user has joined',function(data){
        console.log("user has joined : " + data.username + ' + ' + data.newChatRoom);
    });
    Socket.on('user has left',function(data){
        console.log("user has left : " + data.username + ' + ' + data.oldChatRoom);
    });

    $scope.switchRoom = function(room){
        $scope.selectedRoom = room;
        $scope.chatRoomName = $scope.selectedRoom.name;
        $scope.$storage.currentChatRoom = $scope.selectedRoom;
        console.log($scope.$storage.currentChatRoom);
        console.log($sessionStorage);
        Socket.emit('switch room', {
            oldChatRoom: tempRoom.name,
            newChatRoom: $scope.selectedRoom.name,
            username: username
        });
        getLastMessage();
        tempRoom = $scope.selectedRoom;
    };
    
    $scope.getPrivateRoom = function(user){
        console.log($scope.allRooms.privateRooms.length);
        for(var i = 0; i < $scope.allRooms.privateRooms.length; i++){
            console.log('getprivateRoom scope : ' + $scope.allRooms.privateRooms[i].name);
            var temp = $scope.allRooms.privateRooms[i].name.split('_');
            console.log(temp);
            if(temp.indexOf(user) !== -1){
                console.log("index trouvé, ca switch direct");
                $scope.switchRoom($scope.allRooms.privateRooms[i]);
                return;
            }
        }

        var newRoom = {
            name : userData.currentUser().username + '_' + user,
            type : 'Private',
            created : new Date()
        };

        //$scope.allRooms.privateRooms.push(newRoom);
        chatData.createPrivateRoom(newRoom).then(function(response){
            console.log('Rooms created : ' + response);
            chatData.updateRoomsUser({
                username : userData.currentUser().username,
                chatRoom: newRoom.name
            }).then(function(response){
                chatData.updateRoomsUser({
                    username : user,
                    chatRoom: newRoom.name
                });
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

    Socket.on('message dispatched', function(data){
        console.log("Message renvoyé par le serveur: " + data.content);
        $scope.messages.push(data);
        $scope.message = "";
    });

    getLastMessage = function(){
        chatData.lastMessages($scope.$storage.currentChatRoom).then(function(response){
            $scope.messages = '';
            $scope.messages = response.data;
        });
    };
    
    $scope.isUrself = function(username){
        if(userData.currentUser().username !== username){
            return true;
        } return false;
    };

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

    /*console.log("Username a envoyer : " + username);
    Socket.emit('addUser', {username: username});



    Socket.on('message', function(data){
        $scope.messages.push(data);
    });


    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });*/
});
