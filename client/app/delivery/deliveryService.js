﻿'use strict';

app.factory('deliveryService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/deliveries/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };
    
    factory.createMany = function (items) {
        return $http.post(rootUrl + 'rpc/createMany', items);
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
    
    factory.count = function(field, value){
        return $http.get(rootUrl + '$count?$filter=' + field + ' eq ' + '\'' + value + '\'').then(function (result) {
            return result.data;
        });        
    }
    
    factory.createLog = function (log) {
        return $http.post(rootUrl + 'rpc/createLog', log);
    };      

    return factory;
}]);