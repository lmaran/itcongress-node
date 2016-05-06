'use strict';

app.controller('brandsController', ['$scope', '$location', 'brandService', 'modalService', 
    function ($scope, $location, brandService, modalService) {
    
    $scope.brands = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        var modalOptions = {
            bodyDetails: item.name,           
        };
        modalService.confirm(modalOptions).then(function (result) {
            // get the index for selected item
            for (var i in $scope.brands) {
                if ($scope.brands[i]._id === item._id) break;
            }

            brandService.delete(item._id).then(function () {
                $scope.brands.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });
        });
    };

    $scope.create = function () {
        $location.path('/admin/brands/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        brandService.getAll().then(function (data) {
            
            // data.forEach(function(brand){
            //     brand.maxAttendees = getMaxAttendees(brand.room);
            // });
            
            $scope.brands = data;
        })
        .catch(function (err) {
            if(err.status !== 401) {
                alert(JSON.stringify(err, null, 4));
            }
        });
    } 

}]);