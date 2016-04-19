'use strict';

(function (sessionValidator) {
    
    var sessionService = require('./sessionService');
    var async = require('async');
    var validator = require('validator');  
    var _ = require('lodash');  
    
    // requiredAndUnique
    sessionValidator.name = function(req, res, cbResult){
        var fieldVal = req.body.name;     
        async.series([
            function(cb){
                if(fieldVal === undefined || fieldVal === ''){
                    cb("Acest camp este obligatoriu.");
                }
                else if(fieldVal && fieldVal.length > 50){
                    cb("Maxim 50 caractere.");
                }
                else cb(null, 'checkNext'); 
            },
            function(cb){
                sessionService.getByValue('name', fieldVal, req.body._id, function (err, session) {
                    if(err) { return handleError(res, err); }
                    if (session) { 
                        cb("Exista deja o inregistrare cu aceasta valoare."); 
                    }
                    else cb(null, 'checkNext');      
                });  
            }        
        ],
        function(err, results){
            if(err == null) 
                cbResult(null, null); // return null if no error
            else    
                cbResult(null, {field:'name', msg: err});
        });
    }; 
    
    // optionalAndUniqueEmail
    sessionValidator.email = function(req, res, cbResult){
        var fieldVal = req.body.email;     
        async.series([
            function(cb){
                if(fieldVal && fieldVal.length > 50){
                    cb("Maxim 50 caractere.");
                }
                else if(fieldVal && !validator.isEmail(fieldVal)){
                    cb("Adresa de email invalida.");
                }                
                else cb(null, 'checkNext');  
            },
            function(cb){
                if(fieldVal)
                    sessionService.getByValue('email', fieldVal, req.body._id, function (err, session) {
                        if(err) { return handleError(res, err); }
                        if (session) { 
                            cb("Exista deja o inregistrare cu aceasta valoare."); 
                        }
                        else cb(null, 'checkNext');      
                    }); 
                else cb(null, 'checkNext'); 
            }                   
        ],
        function(err, results){            
            if(err == null) // no validation errors
                cbResult(null, null);
            else    
                cbResult(null, {field:'email', msg: err});
        });
    }; 
    
    // requiredAndBoolean
    sessionValidator.isActive = function(req, res, cbResult){
        if(req.body._id){ // validate only for update
            var fieldVal = req.body.isActive;     
            async.series([
                function(cb){
                    if(typeof fieldVal !== 'boolean'){
                        cb("Acest camp este obligatoriu sa fie o valoare booleana.");
                    }
                    else cb(null, 'checkNext'); 
                }      
            ],
            function(err, results){
                if(err == null) 
                    cbResult(null, null); // return null if no error
                else    
                    cbResult(null, {field:'isActive', msg: err});
            }) 
        } else {
            cbResult(null, null);
        }
    };  
    
    // optional50
    sessionValidator.badgeCode = function(req, res, cbResult){
        var fieldVal = req.body.badgeCode;     
        async.series([
            function(cb){
                if(fieldVal && fieldVal.length > 50){
                    cb("Maxim 50 caractere.");
                }
                else cb(null, 'checkNext');  
            },
            function(cb){
                if(fieldVal)
                    sessionService.getByValue('badgeCode', fieldVal, req.body._id, function (err, session) {
                        if(err) { return handleError(res, err); }
                        if (session) { 
                            cb("Acest card este deja alocat la o alta persoana."); 
                        }
                        else cb(null, 'checkNext');      
                    }); 
                else cb(null, 'checkNext'); 
            }                    
        ],
        function(err, results){            
            if(err == null) // no validation errors
                cbResult(null, null);
            else    
                cbResult(null, {field:'badgeCode', msg: err});
        });
    };                
          
    // all validations
    sessionValidator.all = function(req, res, cbResult){       
        async.parallel([
            // function(cb){
            //    sessionValidator.name(req, res, cb);
            // },
            function(cb){
               sessionValidator.email(req, res, cb);
            }
            // function(cb){
            //     sessionValidator.isActive(req, res, cb);
            // },
            // function(cb){
            //    sessionValidator.badgeCode(req, res, cb);
            // }                                                 
        ],
        function (err, results) {
            results = _.compact(results); // remove null elements from array
            if(results.length == 0) results = null; // return null if no errors
            cbResult(results);        
        }); 
    }
    
    
    function handleError(res, err) {
        return res.status(500).send(err);
    };
    
})(module.exports);