(function () {
    'use strict';

    angular
        .module('airy.clientTimeSheet')
        .controller('ClientTimeSheetCtrl', ClientTimeSheetCtrl);

    function ClientTimeSheetCtrl($scope, $stateParams, $rootScope, clientResource, calculator) {
        $scope.timesheet = {};
        $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $scope.getTimeSheet = function () {
            clientResource.getTimeSheet($stateParams.clientId, $scope.range).success(function (data) {
                $rootScope.title = data.timesheet.client.name + ' :: Timesheet';
                $scope.timesheet = data.timesheet;
                $scope.client = data.timesheet.client;
            });
        };
        $scope.$watch('range', $scope.getTimeSheet, true);
        $scope.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format(),
        };

        $scope.showCalculator = function (duration) {
            calculator.show(duration);
        };

        $scope.sendByEmail = function () {
            clientResource.sendTimeSheet($stateParams.clientId, $scope.range);
        };
    }
})();
