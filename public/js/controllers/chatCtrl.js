/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, userData, chatData, $sessionStorage){

    Socket.connect();

    var tempRoom = {};
    $scope.selectedRoom = {};
    $scope.dataRooms = {};
    $scope.$storage = $sessionStorage;
    $scope.$storage = $sessionStorage.$default({
        currentChatRoom: userData.currentUser().chatRooms[0]
    });

    chatData.userRooms().then(function(response){
        console.log(response);
        $scope.dataRooms = response;
        $scope.selectedRoom = $scope.$storage.currentChatRoom;
        tempRoom = $scope.selectedRoom;
    });
    $scope.users = [];
    $scope.messages = [];
    $scope.currentUser = userData.currentUser();

    console.log($scope.currentUser.chatRooms);

    var username = $scope.currentUser.username;

    // new user enter in the name
    Socket.emit('new user', {
        username: username,
        defaultChatRoom: $scope.$storage.currentChatRoom
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

    $scope.switchRoom = function(){
        $scope.$storage.currentChatRoom = $scope.selectedRoom;
        console.log($scope.$storage.currentChatRoom);
        console.log($sessionStorage);
        Socket.emit('switch room', {
            oldChatRoom: tempRoom.name,
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
            Socket.emit('message sended', message);
        }
        $scope.msg = '';
    };

    Socket.on('message dispatched', function(data){
        console.log("Message renvoyé par le serveur: " + data.content);
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
