﻿'use strict';

(function (preferenceService) {
    
    var mongoHelper = require('../../data/mongoHelper');
    var mongoService = require('../../data/mongoService');
    var collection = 'preferences';
 
 
    // ---------- OData ----------
    preferenceService.getAll = function (odataQuery, next) {  
        var query = mongoService.getQuery(odataQuery);
        if(query.$sort === undefined) query.$sort = {name: 1};
        mongoService.getAll(collection, query, next);
    };


    // ---------- REST ----------
    preferenceService.create = function (badge, next) {
        mongoService.create(collection, badge, next);
    };
    
    preferenceService.getById = function (id, next) {
        mongoService.getById(collection, id, next);
    };

    preferenceService.update = function (badge, next) {        
        mongoService.update(collection, badge, next);
    };  

    preferenceService.remove = function (id, next) {
        mongoService.remove(collection, id, next);
    };
    
    
    // ---------- RPC ----------    
    preferenceService.getByValue = function (field, value, id, next) {
        mongoService.getByValue(collection, field, value, id, next);
    };       
    
    preferenceService.getByDate = function (dateStr, next) {      
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).find({date:dateStr}, {sort:'employeeName'}).toArray(function (err, docs) {
                if (err) return next(err, null);
                return next(null, docs);                 
            });
        });
    };
    
    preferenceService.getByEmployee = function (name, dateStr, next) {      
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).find({date:{$gte: dateStr}, employeeName:name}, {sort:'date'}).toArray(function (err, docs) {
                if (err) return next(err, null);
                return next(null, docs);                 
            });
        });
    };  
    
    preferenceService.getByEmployeeAndDate = function (name, dateStr, next) { 
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).findOne({date: dateStr, employeeName:name}, next);
        });
    };       
    
    preferenceService.getNextDates = function (todayStr, next) {      
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).aggregate([
                {$match:{date:{$gte: todayStr}}},
                {$group:{_id:"$date"}},
                {$sort:{_id:1}},
                {$group:{_id:null, array:{$push:"$_id"}}},
                {$project:{_id:0, nextDates:"$array"}}
            ]).toArray(function (err, docs) {
                if (err) return next(err, null);
                return next(null, docs);                 
            });
        });
    };    
   
    preferenceService.createMany = function (preferences, next) {
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).insertMany(preferences, next);      
        });
    };
    
    preferenceService.updateMany = function (filter, update, next) {
        console.log(filter);
        console.log(update);
        mongoHelper.getDb(function (err, db) {
            if (err) return next(err, null);
            db.collection(collection).updateMany(filter, update, next);      
        });
    };         

})(module.exports);