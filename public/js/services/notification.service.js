/**
 * Created by Michaël and Martin on 02-08-16.
 */

var notif = angular.module('notificationData', []);

notif.factory('notificationData', notificationData);

notificationData.$inject = ['$http', 'userData'];

function notificationData($http, userData){
    
    allNotifications = function(username){
        var infos = {
            username: username
        };
        return $http.post('/api/listNotifs', infos, {
            headers: {
                Authorization: 'Bearer ' + userData.getToken()
            }
        }).then(function(response){
            console.log(response);
            return response;
        });
    };
    
    createNotification = function(infos){
        return $http.post('/api/notifs', infos,{
            headers: {
                Authorization: 'Bearer ' + userData.getToken()
            }
        }).then(function(response){
            return response;
        });
    };
    
    return {
        allNotifications : allNotifications,
        createNotification : createNotification
    };
}