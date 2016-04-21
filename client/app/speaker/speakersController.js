'use strict';

app.controller('speakersController', ['$scope', '$location', 'speakerService', 'modalService', 
    function ($scope, $location, speakerService, modalService) {
    
    $scope.speakers = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        var modalOptions = {
            bodyDetails: item.name,           
        };
        modalService.confirm(modalOptions).then(function (result) {
            // get the index for selected item
            for (var i in $scope.speakers) {
                if ($scope.speakers[i]._id === item._id) break;
            }

            speakerService.delete(item._id).then(function () {
                $scope.speakers.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });
        });
    };

    $scope.create = function () {
        $location.path('/admin/speakers/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        speakerService.getAll().then(function (data) {
            
            // data.forEach(function(speaker){
            //     speaker.maxAttendees = getMaxAttendees(speaker.room);
            // });
            
            $scope.speakers = data;
        })
        .catch(function (err) {
            if(err.status !== 401) {
                alert(JSON.stringify(err, null, 4));
            }
        });
    } 

}]);