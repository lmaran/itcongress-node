'use strict';

(function (speakerService) {
    
    var mongoService = require('../../data/mongoService');
    var mongoHelper = require('../../data/mongoHelper');
    var _ = require('lodash');
    var collection = 'speakers';
 
 
    // ---------- OData ----------
    speakerService.getAll = function (odataQuery, next) {  
        var query = mongoService.getQuery(odataQuery);
        if(query.$sort === undefined) query.$sort = {timeSlot: 1, room:1}; // sort by name (asc)
        mongoService.getAll(collection, query, next);
    };


    // ---------- REST ----------
    speakerService.create = function (badge, next) {
        mongoService.create(collection, badge, next);
    };
        
    speakerService.getById = function (id, next) {
        mongoService.getById(collection, id, next);
    };

    speakerService.update = function (badge, next) {        
        mongoService.update(collection, badge, next);
    };  

    speakerService.remove = function (id, next) {
        mongoService.remove(collection, id, next);
    };
    
    
    // ---------- RPC ----------    
    speakerService.getByValue = function (field, value, id, next) {
        mongoService.getByValue(collection, field, value, id, next);
    };             
    
})(module.exports);