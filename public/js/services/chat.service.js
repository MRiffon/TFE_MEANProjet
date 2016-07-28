/**
 * Created by Michaël and Martin on 09-06-16.
 */

var chat = angular.module('chatData', []);

chat.factory('chatData', chatData);

chatData.$inject = ['$http', 'userData', '$sessionStorage'];

function chatData($http, userData, $sessionStorage){

    var userRooms = function(){
        return $http.get('/api/getRooms').then(function(response){
            var userRoomsName = $sessionStorage.user.chatRooms;
            var userRooms = [];
            var allRooms = response.data;
            var i;
            var j;

            for (i = 0; i < allRooms.length; i++){
                for (j = 0; j < allRooms.length; j++){
                    if (userRoomsName[i] === allRooms[j].name){
                        userRooms.push(allRooms[j]);
                    }
                }
            }

            return fillInRooms(userRooms);
        });
    };

    var lastMessages = function(room){
        return $http.post('/api/getMsgs', room).then(function(response){
            return response;
        });
    };

    function fillInRooms(allRooms){
        var userRooms = {
            globalRooms : [],
            groupRooms : [],
            privateRooms : []
        };

        for(var i = 0; i < allRooms.length; i++){
            if(allRooms[i].type === 'Global'){
                userRooms.globalRooms.push(allRooms[i]);
            } else if(allRooms[i].type === 'Group'){
                userRooms.groupRooms.push(allRooms[i]);
            } else if(allRooms[i].type === 'Private'){
                console.log('PrivateRooms added : ' + allRooms[i]);
                userRooms.privateRooms.push(allRooms[i]);
            }
        }
        return userRooms;
    }

    var createNewRoom = function(room){
        if(userData.currentUser().chatRooms.indexOf(room.name) !== -1){
            console.log("Error. Room already existing");
        }
        else{
            console.log("Creating new chatRoom : " + room.name);
            return $http.post('/api/newRoom', room).then(function(response){
                return response;
            });
        }

    };

    var updateUsersRoom = function(req){
        if(userData.currentUser().chatRooms.indexOf(req.chatRoom) !== -1){
            console.log("Error. User has already this room");
        }
        else{
            console.log("user rooms updated");
            $http.put('/api/updateRooms', req);
        }

    };

    return {
        userRooms: userRooms,
        lastMessages: lastMessages,
        createNewRoom : createNewRoom,
        updateUsersRoom : updateUsersRoom
    };
}