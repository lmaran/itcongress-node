'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/admin/brands', {
            controller: 'brandsController',
            templateUrl: 'app/brand/brands.html',
			title: 'Brands',
	        //not reload the view if the search part of the url changes. 
            // http://stackoverflow.com/a/14974448/2726725            
            reloadOnSearch:false
	    })
	    .when('/admin/brands/create', {
	        controller: 'brandController',
	        templateUrl: 'app/brand/brand.html',
	        title: 'Adauga brand'
	    })
	    .when('/admin/brands/:id', {
	        controller: 'brandController',
	        templateUrl: 'app/brand/brand.html',
	        title: 'Editeaza brand',
            isEditMode: true 
	    });	
}]);