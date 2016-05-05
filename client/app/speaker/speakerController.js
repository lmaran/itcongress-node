/*global app*/
'use strict';

app.controller('speakerController', ['$scope', '$route', 'speakerService', '$location', '$q', 'helperValidator', 'Upload',
    function ($scope, $route, speakerService, $location, $q, helperValidator, Upload) {
       
    var promiseToGetspeaker;        
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
    
    $scope.brands = [
        {name: 'ADVANTECH'},
        {name: 'DELL'},
        {name: 'CISCO'},
        {name: 'CITRIX'},
        {name: 'MICROSOFT'},
        {name: 'VEEAM'},
        {name: 'SAMSUNG'},
        {name: 'NETAPP'},
        {name: 'ORACLE'},
        {name: 'XEROX'},
        {name: 'FORTINET'},
        {name: 'HIKVISION'},
        {name: 'VMWARE'},
        {name: 'PALO ALTO'},
        {name: 'HP'},
        {name: 'EXCEL NETWORKING'},
        {name: 'ELO DIGITAL'},
    ];       
    
    $scope.speaker = {};
    $scope.errors = {};
   
    if ($scope.isEditMode) {  
        init(); 
    }

    function init() {
        getspeaker();          
    } 

    function getspeaker() {
        promiseToGetspeaker = speakerService.getById($route.current.params.id).then(function (data) {
            $scope.speaker = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }        

    $scope.create = function (form) {  
        // validateForm($scope, form);
        // if (form.$invalid) return false;
        
        //console.log($scope.speaker);
        
        speakerService.create($scope.speaker)
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
        
        //console.log($scope.speaker);
            
        speakerService.update($scope.speaker)
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
    //     var entity = 'speaker'; 
    //     helperValidator.setAllFildsAsValid(form);
        
    //     // fields
    //     //helperValidator.required50($scope, form, entity, 'name');
    //     helperValidator.requiredEmail($scope, form, entity, 'email');
    // } 
    
    // upload on file select or drop
    // https://github.com/danialfarid/ng-file-upload#-usage
    $scope.upload = function (file) {
        Upload.upload({
            url: 'api/speakers/upload',
            data: {
                file: file
            }
        }).then(function (resp) {
            // file is uploaded successfully
            // console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
            // console.log(resp);
            
            $scope.speaker.imageUrl = resp.data.url;
            
        }, function (resp) {
            // handle error
            // console.log('Error status: ' + resp.status);
        }, function (evt) {
            // progress notify
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };        

    $scope.removeImage = function(){
        $scope.speaker.imageUrl = "";
    }

}]);