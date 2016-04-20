'use strict';

(function (sessionService) {
    
    var mongoService = require('../../data/mongoService');
    var mongoHelper = require('../../data/mongoHelper');
    var _ = require('lodash');
    var collection = 'sessions';
 
    var rooms = [
        {id: 'room1', name: 'Presentation Room 1'},
        {id: 'room2', name: 'Presentation Room 2'},
        {id: 'room3', name: 'Focus Group 1'},
        {id: 'room4', name: 'Focus Group 2'},
        {id: 'expo', name: 'Spatiul Expozitional'}
    ]; 
 
    // ---------- OData ----------
    sessionService.getAll = function (odataQuery, next) {  
        var query = mongoService.getQuery(odataQuery);
        if(query.$sort === undefined) query.$sort = {timeSlot: 1, room:1}; // sort by name (asc)
        mongoService.getAll(collection, query, next);
    };


    // ---------- REST ----------
    sessionService.create = function (badge, next) {
        mongoService.create(collection, badge, next);
    };
        
    sessionService.getById = function (id, next) {
        mongoService.getById(collection, id, next);
    };

    sessionService.update = function (badge, next) {        
        mongoService.update(collection, badge, next);
    };  

    sessionService.remove = function (id, next) {
        mongoService.remove(collection, id, next);
    };
    
    
    // ---------- RPC ----------    
    sessionService.getByValue = function (field, value, id, next) {
        mongoService.getByValue(collection, field, value, id, next);
    };    
    
    sessionService.getByEventId = function (eventId, user, next) {      
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).find({eventId:eventId}, {sort: {day:1, timeSlot:1}}).toArray(function (err, docs) {
                if (err) return next(err, null);
                
                //console.log(111);        
                _.forEach(docs, function(session){
                    var roomObj = _.find(rooms, {id:session.room});
                    if(roomObj){
                        session.room = roomObj.name;
                    };
                });
                
                if(user){
                    var attendeeService = require('../../api/attendee/attendeeService');
                    attendeeService.getByValue('email', user.email, null, function (err, attendee){
                        if (err) return next(err, null);
                        
                        // add a flag to see if user is registered or not
                        _.forEach(docs, function(session){
                            session.isRegistered = attendee && attendee.registeredSessions && attendee.registeredSessions.indexOf(session._id.toString()) != -1;
                        });   
                        // console.log(docs);
                        return next(null, docs);                                              
                    });    
                } else {                            
                    //console.log(docs);
                    return next(null, docs);   
                }              
            });
        });
    };       
    
})(module.exports);