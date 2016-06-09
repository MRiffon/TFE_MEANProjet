/**
 * Created by Michaël and Martin on 08-04-16.
 */

var data = angular.module('profilData', []);

data.factory('profilData', profilData);
profilData.$inject = ['$http', 'log'];

function profilData($http, log){

    var getProfil = function(){
        return $http.get('/api/profil', {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        });
    };

    return {
        getProfil: getProfil
    };
}