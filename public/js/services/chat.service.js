/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http', 'userData'];

function chatData($http, userData){

    var messagesRoom = function(){
        return $http.get('/api/getMsgs').then(function(response){
            console.log();
        });
    };

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
            return fillInRooms(userRooms);
        });
    };

    var lastMessages = function(room){
        console.log("room : " + room.name);
        return $http.post('/api/getMsgs', room).then(function(response){
            return response;
        });
    };

    function fillInRooms(userRooms){
        var allRooms = {
            globalRooms : [],
            groupRooms : [],
            privateRooms : []
        };

        for(var i = 0; i < userRooms.length; i++){
            if(userRooms[i].type === 'Global'){
                allRooms.globalRooms.push(userRooms[i]);
            } else if(userRooms[i].type === 'Group'){
                allRooms.groupRooms.push(userRooms[i]);
            } else if(userRooms[i].type === 'Private'){
                allRooms.privateRooms.push(userRooms[i]);
            }
        }
        return allRooms;
    }
    
    createPrivateRoom = function(room){
        return $http.post('/api/newRoom', room).then(function(response){
            return response;
        });
    };
    
    return {
        userRooms: userRooms,
        lastMessages: lastMessages,
        createPrivateRoom : createPrivateRoom
    };
}