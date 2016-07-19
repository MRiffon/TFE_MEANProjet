/**
 * Created by Martouf on 18-07-16.
 */

var calendar = angular.module('calendarData', []);

calendar.factory('calendarData', calendarData);

calendar.$inject = ['uiCalendarConfig', '$q'];

function calendarData(uiCalendarConfig, $q) {
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
        if (gapi.auth != undefined && isAppAuthorized == false) {
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
            var formattedEvents = [];
            for (var i = 0; i < events.length; i++){
                var singleEvent = {title : events[i].summary,
                    start : new Date(events[i].start.dateTime)};
                console.log(singleEvent.title);
                formattedEvents.push(singleEvent);
            }
            deferred.resolve(formattedEvents);
        });
    }

    return {
        loadEvents : loadEvents
    }
}