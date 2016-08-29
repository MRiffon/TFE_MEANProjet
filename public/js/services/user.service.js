/**
 * Created by Michaël and Martin on 06-04-16.
 */

var auth = angular.module('userData', []);

auth.factory('userData', userData);

userData.$inject = ['$http', '$window', 'Socket', '$sessionStorage'];
function userData($http, $window, Socket, $sessionStorage){

    var saveToken = function(token){
        $window.localStorage['mean-token'] = token;
    };

    var getToken = function(){
        return $window.localStorage['mean-token'];
    };

    logout = function(username){
        $window.localStorage.removeItem('mean-token');
    };

    var loggedIn = function(){
        var token = getToken();
        var payload;

        if(token){
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return payload.expire > Date.now()/1000;
        } else return false;
    };

    var currentUser = function(){
        if(loggedIn()){
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            var userInfos = {
                _id : payload._id,
                email : payload.email,
                username : payload.username,
                role : payload.role,
                status : payload.status,
                chatRooms : payload.chatRooms
            };

            return userInfos;
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

    isAdmin = function(user){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        if(payload.role === "Admin"){
            return true;
        } return false;
    };

    return {
        saveToken : saveToken,
        getToken : getToken,
        logout : logout,
        loggedIn : loggedIn,
        currentUser : currentUser,
        login : login,
        isAdmin : isAdmin
    };
}