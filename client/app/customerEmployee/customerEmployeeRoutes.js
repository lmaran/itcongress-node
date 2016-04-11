'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/admin/customerEmployees', {
            controller: 'customerEmployeesController',
            templateUrl: 'app/customerEmployee/customerEmployees.html',
			title: 'Whitelist',
	        //not reload the view if the search part of the url changes. 
            // http://stackoverflow.com/a/14974448/2726725            
            reloadOnSearch:false
	    })
	    .when('/admin/customerEmployees/create', {
	        controller: 'customerEmployeeController',
	        templateUrl: 'app/customerEmployee/customerEmployee.html',
	        title: 'Adauga email'
	    })
	    .when('/admin/customerEmployees/:id', {
	        controller: 'customerEmployeeController',
	        templateUrl: 'app/customerEmployee/customerEmployee.html',
	        title: 'Editeaza email',
            isEditMode: true 
	    });	
}]);