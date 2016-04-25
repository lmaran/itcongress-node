'use strict';

var sessionService = require('./sessionService');
var sessionValidator = require('./sessionValidator');
var config = require('../../config/environment');
var emailService = require('../../data/emailService');
var _ = require('lodash'); 


// ---------- OData ----------
exports.getAll = function (req, res) {
    var odataQuery = req.query;
    odataQuery.hasCountSegment = req.url.indexOf('/$count') !== -1 //check for $count as a url segment
    if(!odataQuery.$top) odataQuery.$top = "4000"; // if $top is not specified, return max. 1000 records
  
    sessionService.getAll(odataQuery, function (err, sessions) {
        if(err) { return handleError(res, err); }       
        res.status(200).json(sessions);        
    });
};


// ---------- REST ----------
exports.create = function(req, res){
    // sessionValidator.all(req, res, function(errors){
    //     if(errors){
    //         res.status(400).send({ errors : errors }); // 400 - bad request
    //     }
    //     else {
            var session = req.body;
            
            //session.isActive = true;
            session.eventId = "itcongress2016";
            session.createBy = req.user.name;    
            session.createdOn = new Date();              
            
            sessionService.create(session, function (err, response) {
                if(err) { return handleError(res, err); }
                res.status(201).json(response.ops[0]);
            });           
    //     }
    // });    
};

exports.getById = function (req, res) {
    sessionService.getById(req.params.id, function (err, session) {
        if(err) { return handleError(res, err); }
        res.json(session);
    });    
};

exports.update = function(req, res){
    var session = req.body;
    // sessionValidator.all(req, res, function(errors){
    //     if(errors){
    //         res.status(400).send({ errors : errors }); // 400 - bad request
    //     }
    //     else {
            
            session.modifiedBy = req.user.name;    
            session.modifiedOn = new Date(); 
            
            if(session.askForNotification){
                var askForNotification = session.askForNotification;
                delete session.askForNotification;
            } 
            
            // update customer
            sessionService.update(session, function (err, response) {
                if(err) { return handleError(res, err); }                   
                res.sendStatus(200);
            });
    //     }
    // });
};

exports.remove = function(req, res){
    var id = req.params.id;
    sessionService.remove(id, function (err, response) {
        if(err) { return handleError(res, err); }
        res.sendStatus(204);
    });
};

exports.checkEmail = function (req, res) {
    var email = req.params.email;
       
    sessionService.getByValue('email', email, null, function (err, session) {
        if(err) { return handleError(res, err); }

        if(session){
            res.send(true);
        } else {
            res.send(false);
        }   
    }); 
};

// ---------- Helpers ----------
function handleError(res, err) {
    return res.status(500).send(err);
};