/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http', 'userData'];

function chatData($http, userData){
    
    var userRooms = function(){
        return $http.get('/api/getRooms').then(function(response){
            var userRoomsName = userData.currentUser().chatRooms;
            var userRooms = [];
            var allRooms = response.data;
            var i;
            var j;

            for (i = 0; i < userRoomsName.length; i++){
                for (j = 0; j < allRooms.length; j++){
                    if (userRoomsName[i] === allRooms[j].name){
                        userRooms.push(allRooms[j]);
                    }
                }
            }
            return userRooms;
        });
    };
    
    return {
        userRooms: userRooms
    };
}