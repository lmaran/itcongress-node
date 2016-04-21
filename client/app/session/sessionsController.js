'use strict';

app.controller('sessionsController', ['$scope', '$location', 'sessionService', 'modalService', 
    function ($scope, $location, sessionService, modalService) {
    
    $scope.sessions = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        var modalOptions = {
            bodyDetails: item.name,           
        };
        modalService.confirm(modalOptions).then(function (result) {
            // get the index for selected item
            for (var i in $scope.sessions) {
                if ($scope.sessions[i]._id === item._id) break;
            }

            sessionService.delete(item._id).then(function () {
                $scope.sessions.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });
        });
    };

    $scope.create = function () {
        $location.path('/admin/sessions/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        sessionService.getAll().then(function (data) {
            
            data.forEach(function(session){
                session.maxAttendees = getMaxAttendees(session.room);
            });
            
            $scope.sessions = data;
        })
        .catch(function (err) {
            if(err.status !== 401) {
                alert(JSON.stringify(err, null, 4));
            }
        });
    }
    
    function getMaxAttendees(room) {
        switch (room) {
            case "room1":
                return 230;
            case "room2":
                return 230;
            case "room3":
                return 80;
            case "room4":
                return 80;
            default:
                return '';
        }
    };    

}]);