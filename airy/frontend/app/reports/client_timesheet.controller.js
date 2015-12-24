function ClientTimeSheetCtrl($scope, $stateParams, $rootScope, clientResource, calculator) {
    $scope.timesheet = {};
    $scope.client = {};
    $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.range = {
        beg: moment().startOf('isoWeek').format(),
        end: moment().endOf('isoWeek').format(),
    };
    $scope.$watch('range', getTimeSheet, true);
    $scope.showCalculator = showCalculator;
    $scope.sendByEmail = sendByEmail;

    function getTimeSheet() {
        clientResource.getTimeSheet($stateParams.clientId, $scope.range).success(function (data) {
            $rootScope.title = data.timesheet.client.name + ' :: Timesheet';
            $scope.timesheet = data.timesheet;
            $scope.client = data.timesheet.client;
        });
    }

    function showCalculator(duration) {
        calculator.show(duration);
    }

    function sendByEmail() {
        clientResource.sendTimeSheet($stateParams.clientId, $scope.range);
    }
}

export default ClientTimeSheetCtrl;
