/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('dashboardCtrl', []).controller('dashboardController', function($scope, $location, $http, userData, Socket, $sessionStorage, ngAudio, webNotification){

    webNotification.showNotification('Example Notification', {
        body: 'Notification Text...',
        icon: 'my-icon.ico',
        onClick: function onNotificationClicked() {
            alert('Notification clicked.');
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

    $scope.audio = ngAudio.load("./audio/you-wouldnt-believe.mp3");
    $scope.audio.play();

    $scope.isLogged = userData.loggedIn();
    $scope.currentUser = userData.currentUser();
    $scope.isAdmin = userData.isAdmin();
    $scope.urlImg = "./img/clients/avatar/" + $scope.currentUser._id + ".jpg";

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