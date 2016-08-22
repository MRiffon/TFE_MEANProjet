/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('overviewCtrl', []).controller('overviewController', function($scope, userData, notificationData, Socket){
    $scope.notifs = [];
    $scope.chatNotifs = [];
    $scope.ticketNotifs = [];

    splitNotifications = function(notifs, chatNotifs, ticketNotifs){
        for(var i = 0; i < notifs.length; i++){
            if(notifs[i].identifier === 'Chat'){
                chatNotifs.push(notifs[i]);
            } else if(notifs[i].identifier === 'Ticketting'){
                ticketNotifs.push(notifs[i]);
            } else {}
        }
    };

    getNotifications = function(){
        $scope.notifs = [];
        $scope.chatNotifs = [];
        $scope.ticketNotifs = [];
        notificationData.allNotifications(userData.currentUser().username).then(function(response){
            $scope.notifs = response.data;
            for(var i = 0; i < $scope.notifs.length; i++){
                $scope.notifs[i].created = (new Date().getTime()) - new Date($scope.notifs[i].created).getTime();
                if($scope.notifs[i].created <= 3540000){
                    $scope.notifs[i].created = Math.floor($scope.notifs[i].created / 60000);
                    if($scope.notifs[i].created <= 0){
                        $scope.notifs[i].created = "moins d'une minute";
                    } else $scope.notifs[i].created = $scope.notifs[i].created.toString() + ' minute(s)';
                } else if($scope.notifs[i].created <= 82800000){
                    $scope.notifs[i].created = Math.floor($scope.notifs[i].created / 3600000);
                    $scope.notifs[i].created = $scope.notifs[i].created.toString() + ' heure(s)';
                } else {
                    $scope.notifs[i].created = Math.floor($scope.notifs[i].created / 86400000);
                    $scope.notifs[i].created = $scope.notifs[i].created.toString() + ' jour(s)';
                }
            }

            splitNotifications($scope.notifs, $scope.chatNotifs, $scope.ticketNotifs);
        });
    };
    
    getNotifications();

    Socket.on('newNotif', function(){
        getNotifications();
    });
});