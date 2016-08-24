/**
 * Created by Martouf on 14-07-16.
 */

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('eventModalCtrl', []).controller('modalCalendarController', function ($scope, $uibModalInstance, uiCalendarConfig, calendarData, items) {

    $scope.timeOptions = ['Minutes', 'Heures', 'Jours'];
    $scope.userRole = userData.currentUser().role;
    $scope.calendarsId = {
        personalCalendarId: 'primary',
        companyCalendarId: 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com'
    };

    $scope.calendarsNames = ['Calendrier personnel', 'Calendrier d\'entreprise'];

    //items contient la date du jour de l'évènement
    $scope.items = items;

    $scope.isAdmin = function(){
        //TODO: remplacer par $scope.userRole === 'Admin'
        return(userData.currentUser().username === 'admin');
    };

    $scope.isAlreadyCreated = function(){
        return ($scope.items.calEvent === undefined && $scope.isAdmin());
    };

    $scope.isReadOnly = function() {
        if($scope.items.calEvent !== undefined){
            return !!($scope.items.calEvent.calendarId === $scope.calendarsId.companyCalendarId && !$scope.isAdmin());
        }
        else return false;

    };

    var startTime = new Date();

    console.log($scope.items.date);

    if ($scope.items.calEvent === undefined){
        $scope.title ='Nouvel événement';
        $scope.times = {
            startTime: new Date(null, null, null, $scope.items.date._d.getHours(), $scope.items.date._d.getMinutes(), 0),
            endTime: new Date(null, null, null, $scope.items.date._d.getHours() + 1, $scope.items.date._d.getMinutes(), 0)
        };
        $scope.editEvent = {
            title: '',
            start: '',
            end: '',
            description: '',
            durationReminder: '',
            color :'',
            textColor:'',
            timeUnityReminder: 'Minutes',
            location: '',
            calendarId: 'primary',
            calendarName:''
        };
    }
    else if($scope.items.date === undefined){

        $scope.title = $scope.items.calEvent.title;
        $scope.editButton = true;
        $scope.times = {
            startTime: new Date(null, null, null, $scope.items.calEvent.start._d.getHours(), $scope.items.calEvent.start._d.getMinutes(), 0),
            endTime: new Date(null, null, null, $scope.items.calEvent.end._d.getHours(), $scope.items.calEvent.end._d.getMinutes(), 0)
        };

        $scope.editEvent = $scope.items.calEvent;

        $scope.editEvent.id = $scope.items.calEvent.id;
        if($scope.items.calEvent.durationReminder === undefined){
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
    }

    $scope.saveEvent = function(isValid){
        $scope.submitted = true;

        if(isValid){
            var typeRequest = '';
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
            //TODO: à modifier ! On doit se baser sur le role, pas sur le username.
            if(userData.currentUser().username === "admin"){
                if($scope.editEvent.calendarName === $scope.calendarsNames[0]){
                    $scope.editEvent.calendarId = $scope.calendarsId.personalCalendarId;
                }
                else{
                    $scope.editEvent.calendarId = $scope.calendarsId.companyCalendarId;
                }

            }

            calendarData.sendEvent($scope.editEvent, typeRequest);
            if(typeRequest === 'update'){
                uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvent', $scope.editEvent);
            }
            else if(typeRequest === 'insert'){
                if($scope.editEvent.calendarId === $scope.calendarsId.companyCalendarId){
                    $scope.editEvent.color = 'springGreen';
                    $scope.editEvent.textColor = 'black';
                }
                else{
                    $scope.editEvent.color = 'royalBlue';
                    $scope.editEvent.textColor = 'black';
                }

                uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', $scope.editEvent);
            }
            $uibModalInstance.close();
        }
        console.log("timeUnity : " + $scope.editEvent.timeUnityReminder);
    };

    $scope.deleteEvent = function(){
        calendarData.deleteEvent($scope.editEvent.id);
        uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents', $scope.items.calEvent._id);
        $uibModalInstance.close();
    };
});