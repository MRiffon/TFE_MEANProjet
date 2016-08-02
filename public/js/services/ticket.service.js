/**
 * Created by Michaël and Martin on 30-07-16.
 */

var ticket = angular.module('ticketData', []);

ticket.factory('ticketData', ticketData);

ticketData.$inject = ['$http', 'userData'];

function ticketData($http, log){
    var allTickets = function(){
        return $http.get('/api/tickets', {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };

    var searchedTickets = function(infos){
        return $http.post('/api/searchTickets', infos, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };
    
    var allTicketsStatus = function(){
        return $http.get('/api/ticketStatus').then(function(response){
            return response;
        });
    };
    
    deleteTicket = function(ticket){
        return $http.delete('/api/tickets/'+ticket._id, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };

    createTicket = function(ticket){
        return $http.post('/api/tickets', ticket, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };

    updateTicket = function(ticket){
        return $http.put('/api/editTicket', ticket, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };

    return {
        allTickets : allTickets,
        searchedTickets : searchedTickets,
        allTicketsStatus : allTicketsStatus,
        createTicket : createTicket,
        deleteTicket : deleteTicket,
        updateTicket : updateTicket
    };
}
