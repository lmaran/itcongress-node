'use strict';

var attendeeService = require('./attendeeService');
//var attendeeValidator = require('./attendeeValidator');

// ---------- OData ----------
exports.getAll = function (req, res) {
    var odataQuery = req.query;
    odataQuery.hasCountSegment = req.url.indexOf('/$count') !== -1 //check for $count as a url segment
    if(!odataQuery.$top) odataQuery.$top = "1000"; // if $top is not specified, return max. 1000 records
       
    attendeeService.getAll(odataQuery, function (err, attendees) {
        if(err) { return handleError(res, err); }
        res.status(200).json(attendees);        
    });
};


// ---------- REST ----------
exports.create = function(req, res){
    var attendee = req.body;
    attendeeValidator.all(req, res, function(errors){
        if(errors){
            res.status(400).send({ errors : errors }); // 400 - bad request
        }
        else{
            
            attendee.createBy = req.user.name;    
            attendee.createdOn = new Date(); 
                  
            attendeeService.create(attendee, function (err, response) {
                if(err) { return handleError(res, err); }
                res.status(201).json(response.ops[0]);
            });           
        }
    });

};

exports.getById = function (req, res) {
    attendeeService.getById(req.params.id, function (err, attendee) {
        if(err) { return handleError(res, err); }
        res.json(attendee);
    });    
};

exports.update = function(req, res){
    var attendee = req.body;
    attendeeValidator.all(req, res, function(errors){
        if(errors){
            res.status(400).send({ errors : errors }); // 400 - bad request
        }
        else{
            
            attendee.modifiedBy = req.user.name;    
            attendee.modifiedOn = new Date();
            
            if(attendee.option1)
                attendee.option1 = attendee.option1.toUpperCase();
            if(attendee.option2)
                attendee.option2 = attendee.option2.toUpperCase();                       
            
            attendeeService.update(attendee, function (err, response) {
                if(err) { return handleError(res, err); }
                if (!response.value) {
                    res.sendStatus(404); // not found
                } else {
                    res.sendStatus(200);
                }
            });          
        }
    }); 
};

exports.remove = function(req, res){
    var id = req.params.id;
    attendeeService.remove(id, function (err, response) {
        if(err) { return handleError(res, err); }
        res.sendStatus(204);
    });
};


// ---------- RPC ----------
exports.saveMyAction = function(req, res){ 
    var myAction = req.body;
    
    attendeeService.saveMyAction(req.user.email, myAction, function (err, data) {
        if(err) { return handleError(res, err); }
        
        // increment/decrement currentAttendees
        attendeeService.incrementAttendees(myAction, function (err, data) {
            if(err) { return handleError(res, err); }
            res.sendStatus(200);           
        });           
    });         

};


// ---------- Helpers ----------
function handleError(res, err) {
    return res.status(500).send(err);
};


  
  
 
