function ClientTimeSheetCtrl($scope, $stateParams, $rootScope, clientResource, calculator) {
    const self = this;
    self.timesheet = {};
    self.client = {};
    self.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    self.range = {
        beg: moment().startOf('isoWeek').format(),
        end: moment().endOf('isoWeek').format(),
    };
    $scope.$watch('ctrl.range', getTimeSheet, true);
    self.showCalculator = showCalculator;
    self.sendByEmail = sendByEmail;

    function getTimeSheet() {
        clientResource.getTimeSheet($stateParams.clientId, self.range).success(function (data) {
            $rootScope.title = data.timesheet.client.name + ' :: Timesheet';
            self.timesheet = data.timesheet;
            self.client = data.timesheet.client;
        });
    }

    function showCalculator(duration) {
        calculator.show(duration);
    }

    function sendByEmail() {
        clientResource.sendTimeSheet($stateParams.clientId, self.range);
    }
}

export default ClientTimeSheetCtrl;
