/**
 * Created by micka on 30-07-16.
 */

angular.module('addTicketModalCtrl', []).controller('modalAddTicketController', function ($scope, $uibModalInstance, items, adminData, ticketData, userData) {
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

    $scope.items = items;
    
    $scope.selectedDepartment = {};
    $scope.selectedAssigned = {};
    $scope.today = new Date();

    $scope.potentialAssignedUsers = [];
    
    $scope.fillInListPotentialUsers = function(){
        console.log($scope.selectedDepartment);
        var infos = {
            type: 'Department',
            infosToSearch: $scope.selectedDepartment.name
        };
        
        adminData.searchedUsers(infos).then(function(response){
            $scope.potentialAssignedUsers = response.data;
        });
    };
    
    $scope.priorities = ['High', 'Medium', 'Low'];
    
    $scope.selectedDepartment = {};
    $scope.dataLoginInvalid = false;

    adminData.allDepartments().then(function(response){
        $scope.departments = response.data;
    }, function(response){
        console.log(response);
    });

    $scope.saveTicket = function(isValid){
        $scope.submitted = true;
        if(isValid){
            $scope.addTicket.department = $scope.selectedDepartment.name;
            $scope.addTicket.submitter = userData.currentUser().username;
            $scope.addTicket.status = 'Open';
            $scope.addTicket.assigned = $scope.selectedAssigned.username;

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
        }
    };
});