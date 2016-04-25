/* global process */
'use strict';

(function (agendaController) {

    var sessionService = require('../../api/session/sessionService');
    var helper = require('../../data/dateTimeHelper');
    var _ = require('lodash');
    
    agendaController.renderAgenda = function (req, res, next) { 
        //var todayStr = helper.getRoTodayStr(); // "2016-03-26" 
        var eventId = "itcongress2016";    
        sessionService.getByEventId(eventId, req.user, function (err, sessions) {
            if(err) { return handleError(res, err); }
            
            //console.log(sessions);
            
            var length = sessions.length;
            for (var i = 0; i < length; i++) {
                var session = sessions[i];
                session.smallHr = true;
                if(i+1 < length) {
                    if(sessions[i].timeSlot !== sessions[i+1].timeSlot){
                        session.smallHr=false;
                    }
                } else { // last item
                    session.smallHr=false;
                }
                
                var rooms = [
                    {id: 'room1', name: 'Presentation Room 1'},
                    {id: 'room2', name: 'Presentation Room 2'},
                    {id: 'room3', name: 'Focus Group 1'},
                    {id: 'room4', name: 'Focus Group 2'}
                ]; 
    
                session.isRealEvent = _.some(rooms, {name:session.room});
            }

            
            var context = {
                user: req.user,
                sessions: sessions,
                isAuthenticated: !!req.user
            };
            
            res.render('agenda/agenda', context);
            
        });    
    }     
    
    function handleError(res, err) {
        return res.status(500).send(err);
    };

})(module.exports);