'use strict';

(function (attendeeService) {
    
    var mongoService = require('../../data/mongoService');
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
    
})(module.exports);