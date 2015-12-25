function ClientReportController($scope, $stateParams, $rootScope, clientResource, calculator) {
    const self = this;
    self.report = {};
    self.client = {};
    self.periods = [
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
    self.period = self.periods[0];
    self.setPeriod = setPeriod;
    self.range = {
        beg: moment().startOf('isoWeek').format(),
        end: moment().endOf('isoWeek').format(),
    };
    $scope.$watch('ctrl.range', getReport, true);
    self.showCalculator = showCalculator;
    self.sendByEmail = sendByEmail;

    function getReport() {
        clientResource.getReport($stateParams.clientId, self.range).success(function (data) {
            $rootScope.title = data.report.client.name + ' :: Task report';
            self.report = data.report;
            self.client = data.report.client;
        });
    }

    function setPeriod() {
        self.range.end = self.period.getRangeEnd(self.range.beg);
    }

    function showCalculator(duration) {
        calculator.show(duration);
    }

    function sendByEmail() {
        clientResource.sendReport($stateParams.clientId, self.range);
    }
}

export default ClientReportController;
