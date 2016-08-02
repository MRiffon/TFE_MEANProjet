/**
 * Created by micka on 30-07-16.
 */

angular.module('ticketModalCtrl', []).controller('modalTicketController', function ($scope, $uibModalInstance, items, adminData, ticketData, userData) {

    $scope.items = items;

    $scope.selectedDepartment = {};
    $scope.selectedAssigned = {};
    $scope.selectedDeadline = '';

    $scope.isAdd = false;
    $scope.isEdit = false;

    $scope.today = new Date();
    $scope.status = [];
    $scope.addedComment = '';
    $scope.departments = [];
    $scope.potentialAssignedUsers = [];

    $scope.priorities = ['High', 'Medium', 'Low'];

    $scope.dataLoginInvalid = false;

    // fonction permettant de savoir quel type de modal il s'agit, attribue un bolléan à une variable
    whichTypeModal = function(){
        if($scope.items.typeModal === 'add'){
            $scope.isAdd = true;
        } else $scope.isEdit = true;
    };

    // au changement des départements, on change les users disponibles
    $scope.fillInListPotentialUsers = function(){
        var infos = {
            type: 'Department',
            infosToSearch: $scope.selectedDepartment
        };

        adminData.searchedUsers(infos).then(function(response){
            var potentialUsers = response.data;
            for(var i = 0; i < potentialUsers.length; i++){
                $scope.potentialAssignedUsers[i] = potentialUsers[i].username;
            }
        });
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

    ticketData.allTicketsStatus().then(function(response){
        var status = response.data;
        for(var i = 0; i < status.length; i++){
            $scope.status[i] = status[i].name;
        }
    }, function(response){
        console.log(response);
    });

    whichTypeModal();

    // si on ajoute un ticket
    if($scope.isAdd){
        $scope.title = 'Nouveau ticket';
        $scope.txtButton = 'Créer le ticket';

        $scope.addTicket = {
            subject: '',
            description : '',
            priority : '',
            submitter : '',
            status : '',
            client : '',
            assigned : '',
            department : '',
            deadline : ''
        };

        $scope.displayDate = new Date();
        console.log($scope.today);

    // si on edit un ticket
    } else if($scope.isEdit){

        $scope.title = 'Editer ce ticket';
        $scope.txtButton = 'Sauvergarder';
        $scope.addTicket = $scope.items.ticket;

        $scope.selectedDepartment = $scope.items.ticket.department;
        $scope.selectedAssigned = $scope.items.ticket.assigned;

        var infos = {
            type: 'Department',
            infosToSearch: $scope.selectedDepartment
        };

        adminData.searchedUsers(infos).then(function(response){
            var potentialUsers = response.data;
            for(var i = 0; i < potentialUsers.length; i++){
                $scope.potentialAssignedUsers[i] = potentialUsers[i].username;
            }
        });

        $scope.displayDate = new Date($scope.items.ticket.deadline);
        $scope.items.ticket.deadline = '';
        $scope.selectedDeadline = $scope.displayDate;
    }

    // On crée ou on édite un ticket
    $scope.saveTicket = function(isValid){
        $scope.submitted = true;
        if(isValid){

            $scope.addTicket.department = $scope.selectedDepartment;
            $scope.addTicket.assigned = $scope.selectedAssigned;
            $scope.addTicket.updated = new Date();
            $scope.addTicket.lastUpdateBy = userData.currentUser().username;
            $scope.addTicket.deadline = $scope.selectedDeadline;
            
            if($scope.isAdd){
                $scope.addTicket.submitter = userData.currentUser().username;
                $scope.addTicket.status = 'Open';

                $scope.items.ticket = $scope.addTicket;
                $scope.items.status = 'ticketAdded';

                ticketData.createTicket($scope.addTicket).then(function(response){
                    var msg = response.data.message;
                    if(msg === 'Created!'){
                        $uibModalInstance.close();
                        alert('Ticket créé');
                    } else {
                        console.log('Error');
                        $scope.dataLoginInvalid = true;
                        $scope.msgError = "Une erreur s'est produite !";
                    }
                });
            } else if($scope.isEdit){
                $scope.addTicket._id = $scope.items.ticket._id;
                $scope.addTicket.comment = $scope.addedComment;

                $scope.items.ticket = $scope.editTicket;
                $scope.items.status = 'ticketEdited';
                
                ticketData.updateTicket($scope.addTicket).then(function(response){
                    console.log(response.data);
                    var msg = response.data.message;
                    if(msg === 'Updated!'){
                        $uibModalInstance.close();
                        alert('Ticket mis à jour !');
                    } else {
                        console.log('Error');
                        $scope.dataLoginInvalid = true;
                        $scope.msgError = "Une erreur s'est produite !";
                    }
                });
            }
        }
    };
});