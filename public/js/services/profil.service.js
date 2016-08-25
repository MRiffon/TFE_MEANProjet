/**
 * Created by Michaël and Martin on 08-04-16.
 */

var data = angular.module('profilData', []);

data.factory('profilData', profilData);
profilData.$inject = ['$http', 'userData'];

function profilData($http, userData){

    var getProfil = function(){
        return $http.get('/api/profil', {
            headers: {
                Authorization: 'Bearer ' + userData.getToken()
            }
        });
    };

    updateProfil = function(user){
        console.log(user);
        return $http.put('/api/profil', user, {
            headers: {
                Authorization: 'Bearer ' + userData.getToken()
            }
        }).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };
    
    resetPassword = function(user){
        return $http.post('/api/resetPwd', user, {
            headers: {
                Authorization: 'Bearer ' + userData.getToken()
            }
        }).then(function(response){
            return response;
        });
    };

    return {
        getProfil: getProfil,
        updateProfil: updateProfil,
        resetPassword: resetPassword
    };
}