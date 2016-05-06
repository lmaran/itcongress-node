'use strict';

var brandService = require('./brandService');
var config = require('../../config/environment');
var emailService = require('../../data/emailService');
var _ = require('lodash');

// ---------- OData ----------
exports.getAll = function (req, res) {
    var odataQuery = req.query;
    odataQuery.hasCountSegment = req.url.indexOf('/$count') !== -1 //check for $count as a url segment
    if(!odataQuery.$top) odataQuery.$top = "4000"; // if $top is not specified, return max. 1000 records
  
    brandService.getAll(odataQuery, function (err, brands) {
        if(err) { return handleError(res, err); }       
        res.status(200).json(brands);        
    });
};


// ---------- REST ----------
exports.create = function(req, res){
    var brand = req.body;
    
    brand.createBy = req.user.name;    
    brand.createdOn = new Date();              
    
    brandService.create(brand, function (err, response) {
        if(err) { return handleError(res, err); }
        res.status(201).json(response.ops[0]);
    });               
};

exports.getById = function (req, res) {
    brandService.getById(req.params.id, function (err, brand) {
        if(err) { return handleError(res, err); }
        res.json(brand);
    });    
};

exports.update = function(req, res){
    var brand = req.body;
            
    brand.modifiedBy = req.user.name;    
    brand.modifiedOn = new Date();             
    
    brandService.update(brand, function (err, response) {
        if(err) { return handleError(res, err); }                   
        res.sendStatus(200);
    });
};

exports.remove = function(req, res){
    var id = req.params.id;
    brandService.remove(id, function (err, response) {
        if(err) { return handleError(res, err); }
        res.sendStatus(204);
    });
};

// ---------- RPC ----------

// ---------- Helpers ----------
function handleError(res, err) {
    return res.status(500).send(err);
};