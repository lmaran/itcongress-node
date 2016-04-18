'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/admin/sessions', {
            controller: 'sessionsController',
            templateUrl: 'app/session/sessions.html',
			title: 'Agenda',
	        //not reload the view if the search part of the url changes. 
            // http://stackoverflow.com/a/14974448/2726725            
            reloadOnSearch:false
	    })
	    .when('/admin/sessions/create', {
	        controller: 'sessionController',
	        templateUrl: 'app/session/session.html',
	        title: 'Adauga sesiune'
	    })
	    .when('/admin/sessions/:id', {
	        controller: 'sessionController',
	        templateUrl: 'app/session/session.html',
	        title: 'Editeaza sesiune',
            isEditMode: true 
	    });	
}]);