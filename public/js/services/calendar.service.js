/**
 * Created by Martouf on 18-07-16.
 */

var calendar = angular.module('calendarData', []);

calendar.factory('calendarData', calendarData);

calendar.$inject = ['$q', '$location'];

function calendarData($q, $location) {
    var deferred = $q.defer();

    var loadEvents = function(isAppAuthorized){
        checkAuth(isAppAuthorized);
        return deferred.promise;
    };

    /**
     * Check if current user has authorized this application.
     */
    var checkAuth = function (isAppAuthorized) {
        var CLIENT_ID = '439470814773-juh9o6vamn71r0qrlqpsjqpcr7ir5gpq.apps.googleusercontent.com';
        var SCOPES = ["https://www.googleapis.com/auth/calendar"];
        if (gapi.auth !== undefined && isAppAuthorized == false) {
            gapi.auth.authorize(
                {
                    'client_id': CLIENT_ID,
                    'scope': SCOPES.join(' '),
                    'immediate': true
                }, handleAuthResult);
        }
    };
    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
            // Hide auth UI, then load client library.
            if($location.url() === '/dashboard/calendar'){
                console.log("on a l'autorisation de google");
                authorizeDiv.style.display = 'none';
            }
            return loadCalendarApi();
        } else {
            // Show auth UI, allowing the user to initiate authorization by
            // clicking authorize button.
            authorizeDiv.style.display = 'inline';
        }
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     */
    var handleAuthClick = function(event) {
        gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            handleAuthResult);
    };

    /**
     * Load Google Calendar client library. List upcoming events
     * once client library is loaded.
     */
    function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
    }

    function listCalendars(){
        var request = gapi.client.calendar.calendarList.list({});
        request.execute(function(resp){
           console.log(resp.items);
        });
    }

    function loadPersonnalCalendar() {
        var personnalEvents = [];
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function (resp) {
            var events = resp.items;


            for (var i = 0; i < events.length; i++) {
                var singleEvent = {
                    title: events[i].summary,
                    start: new Date(events[i].start.dateTime),
                    end: new Date(events[i].end.dateTime),
                    description: events[i].description,
                    location: events[i].location,
                    reminders: events[i].reminders,
                    id: events[i].id
                };
                console.log(singleEvent);
                console.log(new Date().getTime());
                personnalEvents.push(singleEvent);
            }
        });
        return personnalEvents;
    }

    function loadCompanyCalendar() {
        var companyEvents = [];
        var request = gapi.client.calendar.events.list({
            'calendarId': 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function (resp) {
            var events = resp.items;
            console.log(events[0]);

            for (var i = 0; i < events.length; i++) {
                var singleEvent = {
                    title: events[i].summary,
                    start: new Date(events[i].start.dateTime),
                    end: new Date(events[i].end.dateTime),
                    description: events[i].description,
                    location: events[i].location,
                    reminders: events[i].reminders,
                    id: events[i].id
                };
                console.log(singleEvent);
                companyEvents.push(singleEvent);
            }
        });
        return companyEvents;
    }

    /**
     * Renvoie les events récupérés.
     */
    function listUpcomingEvents () {
        var formattedEvents = {
            personnalEvents: loadPersonnalCalendar(),
            companyEvents: loadCompanyCalendar()
        };

        console.log(formattedEvents);
        deferred.resolve(formattedEvents);

    }

    function sendEvent (event, typeRequest) {
        if(event.durationReminder != undefined){
            var minutes = calculateReminderTime(event.timeUnityReminder, event.durationReminder);
            var reminders = {
                useDefault: false,
                overrides: [{
                    method: 'popup',
                    minutes: minutes
                }]
            };
        }


        var body = {
            'calendarId': 'primary',
            'summary': event.title,
            'start': {dateTime: event.start},
            'end': { dateTime: event.end},
            'description': event.description,
            'reminders': reminders,
            'location': event.location,
            'eventId': ''
        };
        var request = {};
        if (typeRequest === 'insert'){
            request = gapi.client.calendar.events.insert(body);
        }
        else if(typeRequest === 'update'){
            body.eventId = event.id;
            request = gapi.client.calendar.events.update(body);
        }


        request.execute(function(resp) {
            console.log(resp);
        });
    }

    function calculateReminderTime(reminderUnity, durationReminder){
        if(reminderUnity === 'Minutes'){
            return durationReminder;
        }
        if(reminderUnity === 'Heures'){
            return durationReminder * 60;
        }
        if(reminderUnity ==='Jours'){
            return durationReminder * 1440;
        }
    }

    function deleteEvent(eventId){
        var body = {
            'calendarId': 'primary',
            'eventId': eventId
        };

        request = gapi.client.calendar.events.delete(body);
        request.execute(function(resp) {
            console.log(resp);
        });

    }

    return {
        loadEvents : loadEvents,
        sendEvent : sendEvent,
        deleteEvent : deleteEvent
    }
}