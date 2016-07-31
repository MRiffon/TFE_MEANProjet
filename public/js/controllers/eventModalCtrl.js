/**
 * Created by Martouf on 14-07-16.
 */

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('eventModalCtrl', []).controller('modalCalendarController', function ($scope, $uibModalInstance, uiCalendarConfig, calendarData, items) {

    $scope.timeOptions = ['Minutes', 'Heures', 'Jours'];

    //items contient la date du jour de l'évènement
    $scope.items = items;

    var startTime = new Date();
    if ($scope.items.calEvent === undefined){

        $scope.title ='Nouvel évènement';

        $scope.times = {
            startTime: new Date(null, null, null, startTime.getHours(), startTime.getMinutes(), 0),
            endTime: new Date(null, null, null, startTime.getHours() + 1, startTime.getMinutes(), 0)
        };

        $scope.editEvent = {
            title: '',
            start: '',
            end: '',
            description: '',
            durationReminder: '',
            timeUnityReminder: 'Minutes',
            location: ''
        };
    }
    else if($scope.items.date === undefined){

        $scope.title = 'Editer évènement';
        $scope.editButton = true;
        console.log($scope.items.calEvent.start._d);
        $scope.times = {
            startTime: new Date(null, null, null, $scope.items.calEvent.start._d.getHours(), $scope.items.calEvent.start._d.getMinutes(), 0),
            endTime: new Date(null, null, null, $scope.items.calEvent.end._d.getHours(), $scope.items.calEvent.end._d.getMinutes(), 0)
        };

            $scope.editEvent = $scope.items.calEvent;

            $scope.editEvent.id = $scope.items.calEvent.id;

            if($scope.items.calEvent.reminders.overrides !== undefined){
                if($scope.items.calEvent.reminders.overrides[0].minutes >= 1440){
                    $scope.editEvent.durationReminder = $scope.items.calEvent.reminders.overrides[0].minutes / 1440;
                    $scope.editEvent.timeUnityReminder = 'Jours';
                }
                else if ($scope.items.calEvent.reminders.overrides[0].minutes >= 60){
                    $scope.editEvent.durationReminder = $scope.items.calEvent.reminders.overrides[0].minutes / 60;
                    $scope.editEvent.timeUnityReminder = 'Heures';
                }
                else{
                    $scope.editEvent.durationReminder = $scope.items.calEvent.reminders.overrides[0].minutes;
                    $scope.editEvent.timeUnityReminder = 'Minutes';
                }
            }

    }

    /*
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };*/

    $scope.saveEvent = function(isValid){
        $scope.submitted = true;

        if(isValid){
            var typeRequest = '';
            console.log("Formulaire valide");
            if($scope.items.calEvent === undefined){
                $scope.editEvent.start = new Date($scope.items.date._d);
                $scope.editEvent.start.setHours($scope.times.startTime.getHours());
                $scope.editEvent.start.setMinutes($scope.times.startTime.getMinutes());
                $scope.editEvent.end = new Date($scope.editEvent.start);
                $scope.editEvent.end.setHours($scope.times.endTime.getHours());
                $scope.editEvent.end.setMinutes($scope.times.endTime.getMinutes());
                typeRequest = 'insert';
            }
            else if ($scope.items.date === undefined){
                $scope.editEvent.start = new Date($scope.items.calEvent.start._d);
                $scope.editEvent.start.setHours($scope.times.startTime.getHours());
                $scope.editEvent.start.setMinutes($scope.times.startTime.getMinutes());
                $scope.editEvent.end = new Date($scope.editEvent.start);
                $scope.editEvent.end.setHours($scope.times.endTime.getHours());
                $scope.editEvent.end.setMinutes($scope.times.endTime.getMinutes());
                typeRequest = 'update';
            }

            calendarData.sendEvent($scope.editEvent, typeRequest);
            $uibModalInstance.close();
            uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');

        }
        console.log("timeUnity : " + $scope.editEvent.timeUnityReminder);
    }

    $scope.deleteEvent = function(){
        calendarData.deleteEvent($scope.editEvent.id);
        $uibModalInstance.close();
    }

});