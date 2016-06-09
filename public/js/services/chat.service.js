/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http'];

function chatData($http){
    
    var currentRooms = function(){
        return $http.get('/api/getRooms');
    };
    
    return {
        currentRooms: currentRooms
    };
}