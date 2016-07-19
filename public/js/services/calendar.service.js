/**
 * Created by Martouf on 18-07-16.
 */

var calendar = angular.module('calendarData', []);

calendar.factory('calendarData', calendarData);

calendar.$inject = ['$q'];

function calendarData($q) {
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
            authorizeDiv.style.display = 'none';
            console.log('On a l authorisation de google');
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

    /**
     * Renvoie les events récupérés.
     */
    function listUpcomingEvents () {
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function(resp) {
            var events = resp.items;
            console.log(events[1]);
            var formattedEvents = [];
            for (var i = 0; i < events.length; i++){
                var singleEvent = {
                    title : events[i].summary,
                    start : new Date(events[i].start.dateTime),
                    end : new Date(events[i].end.dateTime),
                    description : events[i].description,
                    location : events[i].location,
                    reminders : events[i].reminders,
                    id : events[i].id
                };
                console.log(singleEvent);
                formattedEvents.push(singleEvent);
            }
            deferred.resolve(formattedEvents);
        });
    }

    function sendEvent (event, typeRequest) {
        if(event.durationReminder != undefined){
            console.log('Y a des minutes');
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