/**
 * Created by Martouf on 26-05-16.
 */

angular.module('calendarCtrl', []).controller('calendarController', function($scope, calendarData, $location, $sessionStorage, $http, uiCalendarConfig, $uibModal, $log){

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
    if($scope.$on('$locationChangeSuccess') && $location.url() == '/dashboard/calendar'){
        gapi_helper.configure({
            clientId: '439470814773-juh9o6vamn71r0qrlqpsjqpcr7ir5gpq.apps.googleusercontent.com',
            apiKey: 'AIzaSyB2-UqdcvGjNdW464ahiWZsc0HdXmblI20',
            scopes: "https://www.googleapis.com/auth/calendar",
            services: {
                calendar: 'v3'
            }
        });
    }
    $scope.handleAuthClick = function(){
        calendarData.handleAuthClick();
    };

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
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

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
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
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,
            dayClick : function(date, jsEvent, view){
                console.log("Clic sur : " + date.format());
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