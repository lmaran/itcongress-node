'use strict';

(function (sessionService) {
    
    var mongoService = require('../../data/mongoService');
    var mongoHelper = require('../../data/mongoHelper');
    var collection = 'sessions';
 
 
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
    
    sessionService.getByEventId = function (eventId, next) {      
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).find({eventId:eventId}, {sort: {day:1, timeSlot:1}}).toArray(function (err, docs) {
                if (err) return next(err, null);
                return next(null, docs);                 
            });
        });
    };       
    
})(module.exports);