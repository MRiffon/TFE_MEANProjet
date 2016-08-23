/**
 * Created by Martouf on 14-07-16.
 */

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('eventModalCtrl', []).controller('modalCalendarController', function ($scope, $uibModalInstance, uiCalendarConfig, calendarData, items, userData) {

    $scope.timeOptions = ['Minutes', 'Heures', 'Jours'];
    $scope.userRole = userData.currentUser().role;
    $scope.isReadOnly = true;
    $scope.calendarsId = {
        personalCalendarId: 'primary',
        companyCalendarId: 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com'
    };

    $scope.calendarsNames = {
        personnalCalendarName: 'Calendrier personnel',
        companyCalendarName: 'Calendrier d\'entreprise'
    };
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
            location: '',
            calendarId: 'primary',
            calendarName:''
        };
    }
    else if($scope.items.date === undefined){

        $scope.title = 'Editer évènement';
        $scope.editButton = true;
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
                if($scope.editEvent.calendarName === $scope.calendarsNames.personnalCalendarName){
                    $scope.editEvent.calendarId = $scope.calendarsId.personalCalendarId;
                }
                else{
                    $scope.editEvent.calendarId = $scope.calendarsId.companyCalendarId;
                }

            }

            calendarData.sendEvent($scope.editEvent, typeRequest);
            $uibModalInstance.close();
            uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvent', $scope.editEvent);
        }
        console.log("timeUnity : " + $scope.editEvent.timeUnityReminder);
    };

    $scope.deleteEvent = function(){
        calendarData.deleteEvent($scope.editEvent.id);
        $uibModalInstance.close();
        uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvent', $scope.items.calEvent);
    };

    /**
     * La fonction isAdmin permet de vérifier que lorsque l'utilisateur accède à un évènement d'entreprise, il possède
     * bien les droits administrateurs. Le cas échéant la fonction renvoie true, false sinon.
     * */
    $scope.isAdmin = function(){
        if($scope.items.calEvent !== undefined){
            if($scope.items.calEvent.calendarId === $scope.calendarsId.companyCalendarId){
                console.log($scope.userRole);
                //TODO: remplacer par $scope.userRole === 'Admin'
                if(userData.currentUser().username === 'admin'){
                    $scope.isReadOnly = false;
                    return true;
                }else{
                    $scope.isReadOnly = true;
                    return false;
                }
            }
        }
        $scope.isReadOnly = false;
        return true;
    };

});