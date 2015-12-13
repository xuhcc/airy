(function () {
    'use strict';

    angular
        .module('airy.clientReport')
        .controller('ClientReportController', ClientReportController);

    function ClientReportController($scope, $stateParams, $rootScope, clientResource, calculator) {
        $scope.report = {};

        $scope.periods = [
            {
                label: '1 week',
                getRangeEnd: function (rangeBeg) {
                    return moment(rangeBeg).endOf('isoWeek').format();
                },
            },
            {
                label: '2 weeks',
                getRangeEnd: function (rangeBeg) {
                    return moment(rangeBeg).add(1, 'week').endOf('isoWeek').format();
                },
            },
        ];
        $scope.period = $scope.periods[0];

        $scope.getReport = function () {
            clientResource.getReport($stateParams.clientId, $scope.range).success(function (data) {
                $rootScope.title = data.report.client.name + ' :: Task report';
                $scope.report = data.report;
                $scope.client = data.report.client;
            });
        };
        $scope.$watch('range', $scope.getReport, true);
        $scope.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format(),
        };

        $scope.setPeriod = function () {
            $scope.range.end = $scope.period.getRangeEnd($scope.range.beg);
        };

        $scope.showCalculator = function (duration) {
            calculator.show(duration);
        };

        $scope.sendByEmail = function () {
            clientResource.sendReport($stateParams.clientId, $scope.range);
        };
    }
})();
