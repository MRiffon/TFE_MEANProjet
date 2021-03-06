/**
 * Created by Martouf on 18-07-16.
 */

var calendar = angular.module('calendarData', []);

calendar.factory('calendarData', calendarData);

calendar.$inject = ['$location', 'uiCalendarConfig'];

function calendarData($location, uiCalendarConfig) {

    /**
     * La méthode configure() permet d'initialiser communication avec Google. Il est nécessaire de passer
     * l'id client et la clé d'api récupéré sur console.developers.google.com. On précise également à quels
     * services on va accéder.
     */
    /*gapi_helper.configure({
        clientId: '439470814773-juh9o6vamn71r0qrlqpsjqpcr7ir5gpq.apps.googleusercontent.com',
        apiKey: 'AIzaSyB2-UqdcvGjNdW464ahiWZsc0HdXmblI20',
        scopes: "https://www.googleapis.com/auth/calendar",
        services: {
            calendar: 'v3'
        }
    });*/
    var date = new Date();
    date.setDate(date.getDate() - 7);

    gapi_helper.when('authorized', function () {
        var authorizeButton = document.getElementById('authorize-button');
        authorizeButton.style.visibility = 'hidden';
    });

    gapi_helper.when('authFailed', function () {
        var authorizeButton = document.getElementById('authorize-button');
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = gapi_helper.requestAuth;
    });

    gapi_helper.when('calendarLoaded', function () {
        uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
        loadPersonnalCalendar();
        loadCompanyCalendar();
    });


    function loadPersonnalCalendar() {
        var personnalEvents = {
            events:[],
            color : 'royalBlue',
            textColor: 'black'
        };
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': date.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });

        request.execute(function (resp) {
            personnalEvents.events = formatGoogleEventsToFullCalendar(resp.items, 'primary');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', personnalEvents);
        });
    }

    function loadCompanyCalendar() {
        var companyEvents = {
            events:[],
            color : 'springGreen',
            textColor: 'black'
        };
        var request = gapi.client.calendar.events.list({
            'calendarId': 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 30,
            'orderBy': 'startTime'
        });

        request.execute(function (resp) {
            var events = resp.items;
            companyEvents.events = formatGoogleEventsToFullCalendar(events, 'm85on1nu9kuaqavesiv5ov3sgo@group.calendar.google.com');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', companyEvents);
        });
    }

    function formatGoogleEventsToFullCalendar(events, calendarId){
        var formattedEvents = [];
        for (var i = 0; i < events.length; i++) {
            var singleEvent = {
                title: events[i].summary,
                calendarId : calendarId,
                start: new Date(events[i].start.dateTime),
                end: new Date(events[i].end.dateTime),
                description: events[i].description,
                location: events[i].location,
                reminders: events[i].reminders,
                id: events[i].id
            };
            formattedEvents.push(singleEvent);
        }
        return formattedEvents;
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
            'calendarId': event.calendarId,
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
            console.log('Evénement enregistré.');
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

    function deleteEvent(eventId, calendarId){
        var body = {
            'calendarId': calendarId,
            'eventId': eventId
        };

        request = gapi.client.calendar.events.delete(body);
        request.execute(function(resp) {
            console.log('Evénement supprimé.');
        });

    }

    return {
        sendEvent : sendEvent,
        deleteEvent : deleteEvent
    }
}