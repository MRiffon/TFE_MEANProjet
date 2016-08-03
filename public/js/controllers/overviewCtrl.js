/**
 * Created by Michaël and Martin on 11-04-16.
 */

angular.module('overviewCtrl', []).controller('overviewController', function($scope, userData, notificationData){
    
    getNotifications = function(){
        notificationData.allNotifications(userData.currentUser().username).then(function(response){
            $scope.notifs = response.data;
            console.log($scope.notifs);
        });
    };
    
    getNotifications();
});