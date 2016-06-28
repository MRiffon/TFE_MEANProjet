/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData){

    Socket.connect();

    var tempRoom = '';
    $scope.selectedRoom = {};
    $scope.dataRooms = {};

    chatData.userRooms().then(function(response){
        console.log(response);
        $scope.dataRooms = response;
        $scope.selectedRoom = $scope.dataRooms[0];
        tempRoom = $scope.selectedRoom.name;
        console.log(tempRoom);
    });
    $scope.users = [];
    $scope.messages = [];
    $scope.currentUser = userData.currentUser();

    console.log($scope.currentUser.chatRooms);

    var username = $scope.currentUser.username;

    // new user enter in the name
    Socket.emit('new user', {
        username: username
    });

    Socket.on('user has joined',function(data){
        console.log("user has joined : " + data.username + ' + ' + data.name);
    });

    $scope.switchRoom = function(){
        console.log("TempRoom === " + tempRoom);
        Socket.emit('switch name', {
            oldChatRoom: tempRoom,
            newChatRoom: $scope.selectedRoom.name,
            username: username
        });
        tempRoom = $scope.selectedRoom;
    };

    $scope.sendMessage = function(msg){
        var message = {
            message: msg,
            room: $scope.selectedRoom.name,
            sender: username
        };
        //$scope.messages.push(msg);
        if(msg !== null && msg !== ''){
            Socket.emit('message', message);
        }
        $scope.msg = '';
    };

    Socket.on('message sended', function(data){
        console.log("Message renvoyé : " + data);
        $scope.messages.push(data);
        $scope.message = "";
    });

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
