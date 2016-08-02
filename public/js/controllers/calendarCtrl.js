/**
 * Created by Martouf on 26-05-16.
 */

angular.module('calendarCtrl', []).controller('calendarController', function($scope, $location, $http){
    var CLIENT_ID = '439470814773-juh9o6vamn71r0qrlqpsjqpcr7ir5gpq.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/calendar"];

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

    $scope.refreshCalendar = function() {
        console.log("alors calendar de mes couilles ? T'es op ?");
            uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSources');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.events);
             uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.companyEvents);
    };

    $scope.getEvents = function(){
        if($scope.isAppAuthorized === false){
            console.log($scope.events.length);
            calendarData.loadEvents($scope.isAppAuthorized).then(function(response){
                $scope.events = response.personnalEvents;
                $scope.companyEvents = response.companyEvents;
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSources');
                uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.events);
                uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', $scope.companyEvents);
            });
            $scope.isAppAuthorized = true;
        }
    };

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

    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
            if(sources[key] === source){
                sources.splice(key,1);
                canAdd = 1;
            }
        });
        if(canAdd === 0){
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function() {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
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