/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('overviewCtrl', []).controller('overviewController', function($scope, userData, chatData, notificationData, Socket, $sessionStorage){
    $scope.notifs = [];
    $scope.chatNotifs = [];
    $scope.ticketNotifs = [];

    $scope.goToConvers = function(notif){
        var tmpArray  = [];
        var chatRoom = '';
        var checkNotif = notif.content.indexOf('nouveau');
        if(checkNotif !== -1){
            var checkNewMessage = notif.content.indexOf('chatroom');
            if(checkNewMessage !== -1){
                tmpArray = notif.content.split(' ');
                chatRoom = tmpArray[tmpArray.indexOf('chatroom') + 1];
            } else {
                tmpArray = notif.content.split(' ');
                var senderMsg = tmpArray[tmpArray.indexOf('de') + 1];
                for(var i = 0; i < $sessionStorage.user.chatRooms.length; i++){
                    if($sessionStorage.user.chatRooms[i].indexOf('_') !== -1){
                        var tmpStrings = $sessionStorage.user.chatRooms[i].split('_');
                        if(tmpStrings.indexOf(senderMsg) !== -1){
                            chatRoom = $sessionStorage.user.chatRooms[i];
                        }
                    }
                }
            }
        } else {
            tmpArray = notif.content.split(' ');
            chatRoom = tmpArray[tmpArray.indexOf(':') + 1];
        }
        chatData.searchRoom(chatRoom).then(function(response){
            $sessionStorage.currentChatRoom = response.data[0];
        })
    };

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