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
            //Renvoie un tableau contenant les objets Rooms.
            return userRooms;
        });
    };

    var lastMessages = function(room){
        console.log("room : " + room.name);
        return $http.post('/api/getMsgs', room).then(function(response){
            console.log("response service last message : " + response.data[0].content);
            return response;
        });
    };
    
    return {
        userRooms: userRooms,
        lastMessages: lastMessages
    };
}