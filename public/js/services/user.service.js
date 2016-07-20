/**
 * Created by Michaël and Martin on 06-04-16.
 */

var auth = angular.module('authentication', []);

auth.factory('userData', log);

log.$inject = ['$http', '$window', 'Socket'];
function log($http, $window, Socket){

    var saveToken = function(token){
        $window.localStorage['mean-token'] = token;
    };

    var getToken = function(){
        return $window.localStorage['mean-token'];
    };

    logout = function(username){
        $window.localStorage.removeItem('mean-token');

        Socket.emit('userDisconnected', {username : username});
    };

    var loggedIn = function(){
        var token = getToken();
        var payload;

        if(token){
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            
            Socket.connect();
            Socket.emit('userConnected', {username: payload.username});
            
            return payload.expire > Date.now()/1000;
        } else return false;
    };

    var currentUser = function(){
        if(loggedIn()){
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return {
                email : payload.email,
                username : payload.username,
                chatRooms : payload.chatRooms
            };
        }
    };

    login = function(user){
        return $http.post('/api/login', user).then(function(response){
            saveToken(response.data.token);
            return response;
        }).catch(function(response){
            return response;
        });
    };

    return {
        saveToken : saveToken,
        getToken : getToken,
        logout : logout,
        loggedIn : loggedIn,
        currentUser : currentUser,
        login : login
    };
}