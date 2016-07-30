/**
 * Created by Michaël and Martin on 30-07-16.
 */

angular.module('ticketCtrl', []).controller('ticketController', function($scope, userData, ticketData, $uibModal){

    $scope.title = 'Tous les tickets';

    fetchAllTickets = function(){
        ticketData.allTickets().then(function(response){
            $scope.tickets = response.data;
        });
    };

    fetchAllTickets();

    $scope.fetchAllTickets = function(){
        fetchAllTickets();
        $scope.title = 'Tous les tickets';
    };

    $scope.fetchOwnTickets = function(){
        var infos = {
            type : 'ownTickets',
            infosToSearch : userData.currentUser().username
        };

        ticketData.searchedTickets(infos).then(function(response){
            $scope.tickets = response.data;
            $scope.title = 'Mes tickets';
        });
    };

    // Suppression d'un ticket avec confirmation
    $scope.deleteTicket = function(ticket){
        var ticketToDelete = ticket;
        ticketData.deleteTicket(ticket);
        $scope.tickets.splice($scope.tickets.indexOf(ticketToDelete.subject), 1);
    };

    
    $scope.whichPriority = function(priority){
        if(priority === 'High'){
            return 'label label-danger';
        } else if(priority === 'Medium'){
            return 'label label-warning';
        } else return 'label label-success';
    };

    $scope.whichStatus = function(status){
        if(status === 'Open'){
            return 'label label-primary';
        } else return 'label label-default';
    };

    $scope.isConcerned = function(ticket){
        if(userData.currentUser().username === ticket.submitter || userData.currentUser().username === ticket.assigned || userData.currentUser().role === 'Admin'){
            return true;
        } else return false;
    };

    // Gestion de la modal pour la création d'un ticket
    $scope.animationsEnabled = true;
    $scope.items = {
        ticket : {},
        status : ''
    };
    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../views/modals/addTicketModalView.html',
            controller: 'modalAddTicketController',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function () {
            if($scope.items.status === 'ticketAdded'){
                $scope.tickets.push($scope.items.ticket);
            }
        });
    };
});
