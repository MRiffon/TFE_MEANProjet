/**
 * Created by Michaël and Martin on 30-07-16.
 */

var ticket = angular.module('ticketData', []);

ticket.factory('ticketData', ticketData);

ticketData.$inject = ['$http', 'userData'];

function ticketData($http, userData){
    var allTickets = function(){
        return $http.get('/api/users', {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };
}
