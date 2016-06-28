/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http', 'userData'];

function chatData($http, userData){
    
    var userRooms = function(){
        return $http.get('/api/getRooms').then(function(response){
            
        });
    };
    
    return {
        userRooms: userRooms
    };
}