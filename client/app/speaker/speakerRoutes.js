'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/admin/speakers', {
            controller: 'speakersController',
            templateUrl: 'app/speaker/speakers.html',
			title: 'Speakers',
	        //not reload the view if the search part of the url changes. 
            // http://stackoverflow.com/a/14974448/2726725            
            reloadOnSearch:false
	    })
	    .when('/admin/speakers/create', {
	        controller: 'speakerController',
	        templateUrl: 'app/speaker/speaker.html',
	        title: 'Adauga speaker'
	    })
	    .when('/admin/speakers/:id', {
	        controller: 'speakerController',
	        templateUrl: 'app/speaker/speaker.html',
	        title: 'Editeaza speaker',
            isEditMode: true 
	    });	
}]);