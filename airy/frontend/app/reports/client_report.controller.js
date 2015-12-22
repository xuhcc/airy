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
    $scope.setPeriod = setPeriod;
    $scope.range = {
        beg: moment().startOf('isoWeek').format(),
        end: moment().endOf('isoWeek').format(),
    };
    $scope.$watch('range', getReport, true);
    $scope.showCalculator = showCalculator;
    $scope.sendByEmail = sendByEmail;

    function getReport() {
        clientResource.getReport($stateParams.clientId, $scope.range).success(function (data) {
            $rootScope.title = data.report.client.name + ' :: Task report';
            $scope.report = data.report;
            $scope.client = data.report.client;
        });
    }

    function setPeriod() {
        $scope.range.end = $scope.period.getRangeEnd($scope.range.beg);
    }

    function showCalculator(duration) {
        calculator.show(duration);
    }

    function sendByEmail() {
        clientResource.sendReport($stateParams.clientId, $scope.range);
    }
}

export default ClientReportController;
