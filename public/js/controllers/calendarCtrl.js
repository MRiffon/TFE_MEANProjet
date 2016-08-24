/**
 * Created by Martouf on 26-05-16.
 */

angular.module('calendarCtrl', []).controller('calendarController', function($scope, calendarData, userData, $location, $sessionStorage, $http, uiCalendarConfig, $uibModal, $log){

    $scope.date = new Date();
    var d = $scope.date.getDate();
    var m = $scope.date.getMonth();
    var y = $scope.date.getFullYear();
    $scope.currentDateTime = new Date('yyyy-MM-ddThh:mm');
    $scope.timeUnityReminder = "";
    $scope.durationReminder = 0;
    $scope.events = [];
    $scope.companyEvents = [];
    $scope.isAppAuthorized = false;
    $scope.isEventsLoaded = false;


    /* event sources array*/
    $scope.eventSources = [];

    /**
     * Si on vient d'arriver sur la page ou si on revient dessus après avoir été sur une autre page,
     * on recharge les évènements.
     */

    gapi_helper.configure({
        clientId: '439470814773-juh9o6vamn71r0qrlqpsjqpcr7ir5gpq.apps.googleusercontent.com',
        apiKey: 'AIzaSyB2-UqdcvGjNdW464ahiWZsc0HdXmblI20',
        scopes: "https://www.googleapis.com/auth/calendar",
        services: {
            calendar: 'v3'
        }
    });


    $scope.handleAuthClick = function(){
        calendarData.handleAuthClick();
    };

    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };

    /* Change View */
    $scope.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };

    /* Render Tooltip Bug avec $compile.
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
        $compile(element)($scope);
    };*/

    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        var typeRequest = 'update';
        if(userData.currentUser().username !== 'admin' && event.calendarId === 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com'){
            alert('Cette opération n\'est pas permise pour les événements d\'entreprises ! Veuillez contacter un responsable.');
            revertFunc();
        }
        calendarData.sendEvent(event, typeRequest);
        uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvent', event);
    };

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 550,
            editable: true,
            timezone: 'local',
            lang:'fr',
            defaultView:'agendaWeek',
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: function(calEvent, jsEvent, view){
                console.log(calEvent);
                $scope.items = {
                    calEvent : calEvent
                };
                $scope.open();
            },
            eventResize: $scope.resize,
            eventDrop: $scope.alertOnDrop,
            eventRender: $scope.eventRender,
            dayClick : function(date, jsEvent, view){
                console.log("Clic sur : " + new Date(date));
                $scope.items = {
                    date: date
                };
                $scope.open();
            }
        }
    };

    $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo= 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };

    /**
     * Partie de code pour le popup modal
     */

    $scope.animationsEnabled = true;
    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '../views/modals/calendarEventModalView.html',
            controller: 'modalCalendarController',
            size: size,
            resolve: {
                items: function () {
                return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});