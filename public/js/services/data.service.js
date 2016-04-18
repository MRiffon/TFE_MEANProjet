/**
 * Created by Michaël and Martin on 08-04-16.
 */

var data = angular.module('dataFetching', []);

data.factory('dataFetch', dataFetch);
dataFetch.$inject = ['$http', 'log'];

function dataFetch($http, log){

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