/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('dashboardCtrl', []).controller('dashboardController', function($scope, $location, $http, userData, Socket, $sessionStorage, ngAudio, webNotification){

    $scope.$storage = $sessionStorage;
    console.log("connection to socket server");
    Socket.connect();
    Socket.emit('userConnected', {username: userData.currentUser().username});

    var showNotification = function(data){
        console.log('ca ouvre une notif');
        webNotification.showNotification(data.identifier, {
            body: data.message,
            icon: '../../img/MEAN_img.png',
            onClick: function onNotificationClicked() {
                
            },
            autoClose: 4000
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                    console.log('Hiding notification....');
                    hide(); //manually close the notification (you can skip this if you use the autoClose option)
                }, 5000);
            }
        });
    };

    /*$scope.audio = ngAudio.load("./audio/you-wouldnt-believe.mp3");
    $scope.audio.play();*/

    $scope.isLogged = userData.loggedIn();
    $scope.currentUser = userData.currentUser();
    $scope.isAdmin = userData.isAdmin();
    $scope.$storage.urlImg = "./img/clients/avatar/" + $scope.currentUser._id + ".jpg" + "?" + new Date().getTime();
    $scope.logout = function(){
        var username = userData.currentUser().username;
        Socket.emit('userDisconnected', {username : username});
        Socket.disconnect(true);
        return $http.get('/api/logout').then(function(){
            userData.logout(userData.currentUser().username);
            $location.path('/');
        }, function(response){
            console.log(response);
        });
    };

    Socket.on('newRoom', function(data){
        if ($location.url() !== '/dashboard/chatroom'){
            console.log(data.chatRoom.name);
            if($sessionStorage.user.chatRooms.indexOf(data.chatRoom.name) == -1){
                $sessionStorage.user.chatRooms.push(data.chatRoom.name);
                console.log("New room received in dash : " + $sessionStorage.user.chatRooms[length]);
            }
            showNotification(data);
        }
    });

    Socket.on('newMessage', function(data){
        console.log('newMessage avant if');
        console.log($location.url());
        if ($location.url() !== '/dashboard/chatroom'){
            console.log('notif-message depuis dashboardctrl');
            showNotification(data);
        }
    });
    
    Socket.on('notifTicket', function(data){
        console.log('notifTicket avant if');
        console.log($location.url());
        if ($location.url() !== '/dashboard/ticketting'){
            console.log('notifTicket depuis dashboardctrl');
            showNotification(data);
        }
    });
});