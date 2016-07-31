/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('dashboardCtrl', []).controller('dashboardController', function($scope, $location, $http, userData, Socket, $sessionStorage){
    $scope.isLogged = userData.loggedIn();
    $scope.currentUser = userData.currentUser();
    $scope.isAdmin = userData.isAdmin();
    $scope.urlImg = "./img/clients/avatar/" + $scope.currentUser._id + ".jpg";
    console.log($scope.urlImg);

    $scope.logout = function(){
        return $http.get('/api/logout').then(function(){
            userData.logout(userData.currentUser().username);
            $location.path('/');
        }, function(response){
            console.log(response);
        });
    };

    Socket.on('newRoom', function(data){
        if ($location.url() !== '/dashboard/chatroom'){
            if($sessionStorage.user.chatRooms.indexOf(data.chatRoom.name) == -1){
                $sessionStorage.user.chatRooms.push(data.chatRoom.name);
                console.log("New room received in dash : " + $sessionStorage.user.chatRooms[length]);
            }
        }
    });
});