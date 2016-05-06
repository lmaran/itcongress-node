﻿'use strict';

app.factory('brandService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/brands/';
    
    // ---------- OData ----------  
    factory.getByBadge = function (badgeCode) {
        var query = "?$filter=badgeCode eq '" + badgeCode + "' and isActive eq true";
        return $http.get(rootUrl + query).then(function (result) {                
            return result.data; // normaly it shoud return an array with 0 or 1 elements
        });
    };
       
    factory.getAllSummary = function () {
        var query = "?$select=_id, name";
        return $http.get(rootUrl + query).then(function (result) {                
            return result.data;
        });
    };     
    
    // ---------- REST ----------
    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    // ---------- RPC ----------
    
    return factory;
}]);