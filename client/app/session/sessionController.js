﻿/*global app*/
/* global _ */
'use strict';

app.controller('sessionController', ['$scope', '$route', 'sessionService', '$location', '$q', 'helperValidator', 'speakerService', 'brandService',
    function ($scope, $route, sessionService, $location, $q, helperValidator, speakerService, brandService) {
       
    var promiseToGetSession, promiseToGetSpeakers, promiseToGetBrands;       
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnEmail = $scope.isEditMode ? false : true;
    
    $scope.obj = {}; //just a wrapper
    
    $scope.isActiveOptions = [{id: true, name: 'Da'},{id: false, name: 'Nu'}];
    
    $scope.timeSlotList = [
        {name: '18 May, 08:45 - 09:30'},
        {name: '18 May, 09:30 - 10:00'},
        {name: '18 May, 10:00 - 10:45'},
        {name: '18 May, 11:00 - 11:45'},
        {name: '18 May, 12:00 - 12:45'},
        {name: '18 May, 12:45 - 14:00'},
        {name: '18 May, 14:00 - 14:45'},
        {name: '18 May, 15:00 - 15:45'},
        {name: '18 May, 16:00 - 16:45'},
        {name: '18 May, 17:00 - 17:45'},
        {name: '18 May, 17:45 - 18:30'},
        
        {name: '19 May, 09:00 - 09:45'},
        {name: '19 May, 10:00 - 10:45'},
        {name: '19 May, 11:00 - 11:45'},
        {name: '19 May, 12:00 - 12:45'},
        {name: '19 May, 12:45 - 14:00'},
        {name: '19 May, 14:00 - 14:45'},
        {name: '19 May, 15:00 - 15:45'},
        {name: '19 May, 16:00 - 16:45'},
        {name: '19 May, 17:00 - 17:45'},
        {name: '19 May, 17:45 - 18:30'}        
    ];
    
    $scope.rooms = [
        {id: 'room1', name: 'Presentation Room 1'},
        {id: 'room2', name: 'Presentation Room 2'},
        {id: 'room3', name: 'Focus Group 1'},
        {id: 'room4', name: 'Focus Group 2'},
        {id: 'expo', name: 'Spatiul Expozitional'}
    ]; 
    
    $scope.brands = []; 
    $scope.speakers = [];      
    
    $scope.session = {};
    $scope.errors = {};
   
    getSpeakers();
    getBrands();
    if ($scope.isEditMode) {  
        init(); 
    }

    
    function init() {
        getSession(); 
        //getSpeakers();
        
        // need it only for initial customer selection
        // http://odetocode.com/blogs/scott/archive/2013/06/19/using-ngoptions-in-angularjs.aspx
        // it seems that with the last version of Angular, you can use 'track by' to substitute this manual loop:
        // https://github.com/angular/angular.js/issues/6564 (comment from jeffbcross - 07.10.2014)
        $q.all([promiseToGetSession, promiseToGetSpeakers])
            .then(function (result) {
                if($scope.session.speaker1){
                    $scope.session.speaker1 = _.find($scope.speakers, {_id: $scope.session.speaker1._id});
                    //console.log($scope.session.speaker1);
                }
                if($scope.session.speaker2){
                    $scope.session.speaker2 = _.find($scope.speakers, {_id: $scope.session.speaker2._id});
                    console.log($scope.session.speaker1);
                }                
            }, function (reason) {
                alert('failure');
            });                  
    } 

    function getSession() {
        promiseToGetSession = sessionService.getById($route.current.params.id).then(function (data) {
            $scope.session = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    } 
    
    function getSpeakers() {
        promiseToGetSpeakers = speakerService.getAllSummary().then(function (data) {
            $scope.speakers = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    } 
    
    function getBrands() {
        promiseToGetBrands = brandService.getAllSummary().then(function (data) {
            $scope.brands = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }               

    $scope.create = function (form) {  
        // validateForm($scope, form);
        // if (form.$invalid) return false;
        
        //console.log($scope.session);
        
        sessionService.create($scope.session)
            .then(function (data) {
                $scope.goBack(); // it comes from rootScope
            })
            .catch(function (err) {
                if(err.data.errors){                   
                    helperValidator.updateValidity($scope, form, err.data.errors);
                } else{
                    alert(JSON.stringify(err.data, null, 4)); 
                }
            }) 
    };

    $scope.update = function (form) {                  
        // validateForm($scope, form);
        // if (form.$invalid) return false;
        
        //console.log($scope.session);
            
        sessionService.update($scope.session)
            .then(function (data) {
                $scope.goBack(); // it comes from rootScope
            })
            .catch(function (err) {
                if(err.data.errors){                   
                    helperValidator.updateValidity($scope, form, err.data.errors);
                } else{
                    alert(JSON.stringify(err.data, null, 4)); 
                }
            });
    };
    
    // function validateForm($scope, form){ 
    //     var entity = 'session'; 
    //     helperValidator.setAllFildsAsValid(form);
        
    //     // fields
    //     //helperValidator.required50($scope, form, entity, 'name');
    //     helperValidator.requiredEmail($scope, form, entity, 'email');
    // }     

}]);