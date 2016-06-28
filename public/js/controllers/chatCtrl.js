/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData){

    Socket.connect();

    var tempRoom = '';
    $scope.selectedRoom = '';
    $scope.dataRooms = {};

    chatData.userRooms().then(function(response){
        $scope.dataRooms = response;
        $scope.selectedRoom = $scope.dataRooms[0];
        tempRoom = $scope.selectedRoom.room;
    });
    $scope.users = [];
    $scope.messages = [];
    $scope.currentUser = userData.currentUser();

    console.log($scope.currentUser.chatRooms);

    var username = $scope.currentUser.username;

    // new user enter in the room
    Socket.emit('new user', {
        username: username
    });

    $scope.switchRoom = function(){
        console.log("TempRoom === " + tempRoom);
        console.log($scope.selectedRoom);
        Socket.emit('switch room', {
            oldChatRoom: tempRoom,
            newChatRoom: $scope.selectedRoom.room,
            username: username
        });
        tempRoom = $scope.selectedRoom.room;
    };

    $scope.sendMessage = function(msg){
        var message = {
            message: msg,
            room: $scope.selectedRoom,
            sender: username
        };
        $scope.messages.push(message);
        if(msg !== null && msg !== ''){
            Socket.emit('message', message);
        }
        $scope.msg = '';
    };

    /*Socket.emit('requestUsers', {});

    console.log("Username a envoyer : " + username);
    Socket.emit('addUser', {username: username});

    Socket.on('users', function(data){
        $scope.users = data.users;
    });

    Socket.on('message', function(data){
        $scope.messages.push(data);
    });

    Socket.on('addUser', function(data){
        $scope.users.push(data.username);
    });

    Socket.on('removeUser', function(data){
        $scope.users.splice($scope.users.indexOf(data.username), 1);
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });*/
});
