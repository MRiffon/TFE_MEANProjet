/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, log){
    Socket.connect();
    
    $scope.users = [];
    $scope.messages = [];
    $scope.currentUser = log.currentUser();

    var username = $scope.currentUser.username;
    
    $scope.sendMessage = function(msg){
        if(msg !== null && msg !== ''){
            console.log('Message à envoyer : ' + msg);
            Socket.emit('message', {message: msg});
        }
        $scope.msg = '';
    };

    Socket.emit('requestUsers', {});

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
    });
});
