'use strict';

app.controller('registerController', ['$scope', 'userService',  '$location', 
    function ($scope, userService, $location) {
        
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
        $scope.submitted = true;
        
        if(form.$valid) {
            userService.create({
                name: $scope.user.name,
                email: $scope.user.email,
                password: $scope.user.password
            })
            .then( function() {
                $location.path('/admin/');
            })
            .catch( function(err) {
                err = err.data;
                $scope.errors = {};
                
                // Update validity of form fields that match the mongoose errors
                angular.forEach(err.errors, function(error, field) {
                    form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = error.message;
                });
            });
        }
    };

}]);
