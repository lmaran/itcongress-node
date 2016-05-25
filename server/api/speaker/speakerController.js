'use strict';

var speakerService = require('./speakerService');
var config = require('../../config/environment');
var emailService = require('../../data/emailService');
var _ = require('lodash'); 
var azure = require('azure-storage');
var multiparty = require('multiparty');


// ---------- OData ----------
exports.getAll = function (req, res) {
    var odataQuery = req.query;
    odataQuery.hasCountSegment = req.url.indexOf('/$count') !== -1 //check for $count as a url segment
    if(!odataQuery.$top) odataQuery.$top = "4000"; // if $top is not specified, return max. 1000 records
  
    speakerService.getAll(odataQuery, function (err, speakers) {
        if(err) { return handleError(res, err); }       
        res.status(200).json(speakers);        
    });
};


// ---------- REST ----------
exports.create = function(req, res){
    var speaker = req.body;
    
    speaker.createBy = req.user.name;    
    speaker.createdOn = new Date();              
    
    speakerService.create(speaker, function (err, response) {
        if(err) { return handleError(res, err); }
        res.status(201).json(response.ops[0]);
    });               
};

exports.getById = function (req, res) {
    speakerService.getById(req.params.id, function (err, speaker) {
        if(err) { return handleError(res, err); }
        res.json(speaker);
    });    
};

exports.update = function(req, res){
    var speaker = req.body;
            
    speaker.modifiedBy = req.user.name;    
    speaker.modifiedOn = new Date();             
    
    speakerService.update(speaker, function (err, response) {
        if(err) { return handleError(res, err); }                   
        res.sendStatus(200);
    });
};

exports.remove = function(req, res){
    var id = req.params.id;
    speakerService.remove(id, function (err, response) {
        if(err) { return handleError(res, err); }
        res.sendStatus(204);
    });
};

// ---------- RPC ----------

exports.uploadImage = function(req, res){
    // todo: do not store the entire url for the picture; use an env variable to keep baseURI 
    var speakersBaseURI = "https://" + config.azureStorage.account + ".blob.core.windows.net/speakers/";
    
    // https://github.com/andrewrk/node-multiparty/blob/master/examples/azureblobstorage.js
    var blobService = azure.createBlobService(config.azureStorage.account, config.azureStorage.key);   
    var form = new multiparty.Form();

    form.on('part', function(part) {
        if (!part.filename) return;

        var size = part.byteCount;
        var blobName = part.filename;
        var containerName = 'speakers';
        
        console.log(part.headers);
        
        var options = {
            contentSettings:{contentType: part.headers['content-type']}
        };
        
        console.log(options);

        blobService.createBlockBlobFromStream(containerName, blobName, part, size, options, function(err, result, response) {
            if (err) {
                // error handling
                // console.log(error);
                handleError(res, err)
            }
            else{
                // console.log(result);
                // console.log(response);
                
                res.json({url:speakersBaseURI + blobName});
            }
        });
    });

    form.parse(req);    
    
    //res.json({ok:'ok'});             
};

// ---------- Helpers ----------
function handleError(res, err) {
    return res.status(500).send(err);
};