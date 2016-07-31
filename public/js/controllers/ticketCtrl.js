/**
 * Created by Michaël and Martin on 30-07-16.
 */

angular.module('ticketCtrl', []).controller('ticketController', function($scope, userData, ticketData, $uibModal){

    $scope.title = 'Tous les tickets';
    $scope.showOneTicket = false;
    $scope.isAdmin = userData.isAdmin();

    // scope à passer à la fonction open() afin de savoir le type d'action
    $scope.addButton = 'add';
    $scope.editButton = 'edit';

    var currentUser = userData.currentUser();
    
    $scope.ticket = {
        subject : '',
        submitter : '', 
        assigned : '',
        deadline : '',
        status : '',
        description : '',
        priority : '',
        department : '',
        updated : ''
    };

    fetchAllTickets = function(){
        ticketData.allTickets().then(function(response){
            $scope.tickets = response.data;
        });
    };

    fetchAllTickets();

    // fetch tous les tickets existants
    $scope.fetchAllTickets = function(){
        fetchAllTickets();
        $scope.title = 'Tous les tickets';
        $scope.showOneTicket = false;
    };

    // fetch tous les tickets concernant l'utilisateur concerné
    $scope.fetchOwnTickets = function(){
        var infos = {
            type : 'ownTickets',
            infosToSearch : userData.currentUser().username
        };

        ticketData.searchedTickets(infos).then(function(response){
            $scope.tickets = response.data;
            $scope.title = 'Mes tickets';
            $scope.showOneTicket = false;
        });
    };

    // Suppression d'un ticket avec confirmation
    $scope.deleteTicket = function(ticket){
        var ticketToDelete = ticket;
        ticketData.deleteTicket(ticket);
        $scope.tickets.splice($scope.tickets.indexOf(ticketToDelete.subject), 1);
    };

    $scope.showTicket = function(ticket){
        $scope.title = 'Consulter un ticket';
        $scope.ticket = ticket;
        $scope.showOneTicket = true;
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
        if(currentUser.username === ticket.submitter || currentUser.username === ticket.assigned || currentUser.role === 'Admin'){
            return true;
        } else return false;
    };

    // Gestion de la modal pour la création ou l'édition d'un ticket
    $scope.animationsEnabled = true;
    $scope.items = {
        ticket : {},
        status : '',
        typeModal : ''
    };
    $scope.open = function (type, ticket, size) {

        $scope.items.typeModal = type;
        if($scope.items.typeModal === 'edit'){
            $scope.items.ticket = Object.create(ticket);
        }

        console.log($scope.items);
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../views/modals/ticketModalView.html',
            controller: 'modalTicketController',
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
