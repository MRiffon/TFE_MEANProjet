/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http', 'userData'];

function chatData($http, userData){
    
    var userRooms = function(){
        return $http.get('/api/getRooms').then(function(response){
            var userRoomsId = userData.currentUser().chatRooms;
            var userRooms = [];
            var allRooms = response.data;
            var i;
            var j;

            for (i = 0; i < userRoomsId.length; i++){
                for (j = 0; j < allRooms.length; j++){
                    console.log(allRooms[j]);
                    if (userRoomsId[i] === allRooms[j]._id){
                        userRooms.push(allRooms[j]);
                    }
                }
            }
            console.log(userRooms);
            return userRooms;
        });
    };
    
    return {
        userRooms: userRooms
    };
}