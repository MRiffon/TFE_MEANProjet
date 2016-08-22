/**
 * Created by Michaël and Martin on 30-07-16.
 */

angular.module('ticketCtrl', []).controller('ticketController', function($scope, userData, ticketData, $uibModal, adminData){

    $scope.title = 'Tous les tickets';
    $scope.showOneTicket = false;
    $scope.showOwnTickets = false;
    $scope.isAdmin = userData.isAdmin();

    // scope à passer à la fonction open() afin de savoir le type d'action
    $scope.addButton = 'add';
    $scope.editButton = 'edit';

    // gestion de la pagination
    $scope.itemsPerPage = 8;
    $scope.currentPage = 1;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.searchOptions = ['Sujet', 'Statut', 'Priorité', 'Département'];
    $scope.typeSearch = 'Sujet';
    $scope.infosToSearch = '';
    $scope.searchSubject = true;

    $scope.status = [];
    $scope.departments = [];
    $scope.priorities = ['High', 'Medium', 'Low'];

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

    // on charge tous les départements pour affichage dans le select
    adminData.allDepartments().then(function(response){
        var departments = response.data;
        for(var i = 0; i < departments.length; i++){
            $scope.departments[i] = departments[i].name;
        }
    }, function(response){
        console.log(response);
    });

    // on charge tous les status de ticket pour affichage dans le select
    ticketData.allTicketsStatus().then(function(response){
        var status = response.data;
        for(var i = 0; i < status.length; i++){
            $scope.status[i] = status[i].name;
        }
    }, function(response){
        console.log(response);
    });

    // fetch tous les tickets existants
    $scope.fetchAllTickets = function(){
        ticketData.allTickets().then(function(response){
            $scope.tickets = response.data;
            $scope.totalTickets = $scope.tickets.length;
        });
        $scope.title = 'Tous les tickets';
        $scope.showOneTicket = false;
        $scope.showOwnTickets = false;
    };

    $scope.fetchAllTickets();

    // fetch tous les tickets concernant l'utilisateur connecté
    $scope.fetchOwnTickets = function(){
        $scope.showOwnTickets = true;
        var infos = {
            type : 'ownTickets',
            infosToSearch : userData.currentUser().username
        };
        
        ticketData.searchedTickets(infos).then(function(response){
            $scope.tickets = response.data;
            $scope.totalTickets = $scope.tickets.length;
            $scope.title = 'Mes tickets';
            $scope.showOneTicket = false;
        });
    };

    // Suppression d'un ticket avec confirmation
    $scope.deleteTicket = function(ticket){
        var ticketToDelete = ticket;
        ticketData.deleteTicket(ticket);
        $scope.tickets.splice($scope.tickets.indexOf(ticketToDelete.subject), 1);
        $scope.totalTickets = $scope.tickets.length;
    };

    // affichage d'un ticket
    $scope.showTicket = function(ticket){
        $scope.title = 'Consulter un ticket';
        $scope.ticket = ticket;
        $scope.showOneTicket = true;
    };

    // recherche sur les tickets selon différents critères présents dans le select
    $scope.searchResults = function(){
        var infos = {
            type : '',
            infosToSearch : $scope.infosToSearch
        };
        if($scope.searchDepartment){
            infos.type = 'Department';
        } else if($scope.searchPriority){
            infos.type = 'Priority';
        } else if($scope.searchStatus){
            infos.type = 'Status';
        } else infos.type = 'Subject';
        
        ticketData.searchedTickets(infos).then(function(response){
            $scope.tickets = response.data;
            $scope.totalTickets = $scope.tickets.length;
        });
    };

    $scope.changeTypeSearch = function(typeSearch){
        $scope.searchDepartment = false;
        $scope.searchSubject = false;
        $scope.searchStatus = false;
        $scope.searchPriority = false;
        if(typeSearch === 'Statut'){
            $scope.searchStatus = true;
        } else if(typeSearch === 'Département'){
            $scope.searchDepartment = true;
        } else if(typeSearch === 'Priorité'){
            $scope.searchPriority = true;
        } else $scope.searchSubject = true;
    };
    
    // changement de classe css en fonction de la priorité du ticket
    $scope.whichPriority = function(priority){
        if(priority === 'High'){
            return 'label label-danger';
        } else if(priority === 'Medium'){
            return 'label label-warning';
        } else return 'label label-success';
    };

    // idem pour le statut
    $scope.whichStatus = function(status){
        if(status === 'Pending'){
            return 'label label-danger';
        } else if(status === 'In Progress'){
            return 'label label-info';
        } else return 'label label-success';
    };

    // permet de savoir si un utilisateur est concerné par un ticket
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
            } else if($scope.items.status === 'ticketEdited'){
                if($scope.showOwnTickets){
                    $scope.fetchOwnTickets();
                } else{
                    $scope.fetchAllTickets();
                }
            }
        });
    };
});
