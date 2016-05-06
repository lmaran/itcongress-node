'use strict';

(function (brandService) {
    
    var mongoService = require('../../data/mongoService');
    var mongoHelper = require('../../data/mongoHelper');
    var _ = require('lodash');
    var collection = 'brands';
 
 
    // ---------- OData ----------
    brandService.getAll = function (odataQuery, next) {  
        var query = mongoService.getQuery(odataQuery);
        if(query.$sort === undefined) query.$sort = {name: 1}; // sort by name (asc)
        mongoService.getAll(collection, query, next);
    };


    // ---------- REST ----------
    brandService.create = function (badge, next) {
        mongoService.create(collection, badge, next);
    };
        
    brandService.getById = function (id, next) {
        mongoService.getById(collection, id, next);
    };

    brandService.update = function (badge, next) {        
        mongoService.update(collection, badge, next);
    };  

    brandService.remove = function (id, next) {
        mongoService.remove(collection, id, next);
    };
    
    
    // ---------- RPC ----------    
    brandService.getByValue = function (field, value, id, next) {
        mongoService.getByValue(collection, field, value, id, next);
    };             
    
})(module.exports);