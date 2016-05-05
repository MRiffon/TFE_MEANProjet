/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket, dataFetch){
    Socket.connect();
    
    $scope.users = [];
    $scope.messages = [];

    dataFetch.getProfil().then(function(response){
        var username = response.data.username;
    });

    $scope.sendMessage = function(msg){
        if(msg !== null && msg !== ''){
            Socket.emit('message', {message: msg});
        }
        $scope.msg = '';
    };
    
    Socket.emit('requestUsers', {});

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
        $scope.messages.push({username: data.username});
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });
});
