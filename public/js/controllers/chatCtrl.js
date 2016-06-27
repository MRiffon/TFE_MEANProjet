/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, log, chatData){
    Socket.connect();

    var tempRoom = '';
    $scope.selectedRoom = '';
    $scope.dataRooms = {};
    chatData.currentRooms().then(function(response){
        $scope.dataRooms = response.data;
        $scope.selectedRoom = $scope.dataRooms[0];
        tempRoom = $scope.selectedRoom.room;
    });

    $scope.users = [];
    $scope.messages = [];
    $scope.currentUser = log.currentUser();

    var username = $scope.currentUser.username;

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
        if(msg !== null && msg !== ''){
            console.log('Message à envoyer : ' + msg);
            Socket.emit('message', {
                message: msg,
                room: $scope.selectedRoom,
                sender: username
            });
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
