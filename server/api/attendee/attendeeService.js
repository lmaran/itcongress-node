'use strict';

(function (attendeeService) {
    
    var mongoService = require('../../data/mongoService');
    var mongoHelper = require('../../data/mongoHelper');
    var collection = 'attendees';
 
 
    // ---------- OData ----------
    attendeeService.getAll = function (odataQuery, next) {  
        var query = mongoService.getQuery(odataQuery);
        if(query.$sort === undefined) query.$sort = {name: 1}; // sort by name (asc)
        mongoService.getAll(collection, query, next);
    };


    // ---------- REST ----------
    attendeeService.create = function (badge, next) {
        mongoService.create(collection, badge, next);
    };
        
    attendeeService.getById = function (id, next) {
        mongoService.getById(collection, id, next);
    };

    attendeeService.update = function (badge, next) {        
        mongoService.update(collection, badge, next);
    };  

    attendeeService.remove = function (id, next) {
        mongoService.remove(collection, id, next);
    };
    
    
    // ---------- RPC ----------    
    attendeeService.getByValue = function (field, value, id, next) {
        mongoService.getByValue(collection, field, value, id, next);
    };   
    
    attendeeService.saveMyAction = function (email, action, next) {
        mongoHelper.getDb(function (err, db) {
            if(action.type === "addToSchedule") {
                db.collection(collection).findOneAndUpdate({email:email}, { $addToSet: { registeredSessions: action.sessionId } }, {upsert:true}, next);
            } else { // removeFromSchedule
                db.collection(collection).findOneAndUpdate({email:email}, { $pull: { registeredSessions: action.sessionId } }, next);
            }            
        })
    };
    
    attendeeService.incrementAttendees = function (action, next) {
        var incValue = action.type === "addToSchedule" ? 1 : -1; // -1 is for decrement
        mongoHelper.getDb(function (err, db) {
            var id = mongoHelper.normalizedId(action.sessionId);
            db.collection('sessions').findOneAndUpdate({_id: id}, { $inc: { currentAttendees: incValue}}, next);          
        })
    };             
    
})(module.exports);