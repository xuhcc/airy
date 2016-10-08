class ClientTimeSheetController {

    constructor($scope, $stateParams, $rootScope, clientResource, calculator) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._clientResource = clientResource;
        this._calculator = calculator;

        this.timesheet = {};
        this.client = {};
        this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format(),
        };

        $scope.$watch('ctrl.range', () => this.getTimeSheet(), true);
    }

    getTimeSheet() {
        this._clientResource.getTimeSheet(this._stateParams.clientId, this.range).success((data) => {
            this._rootScope.title = data.timesheet.client.name + ' :: Timesheet';
            this.timesheet = data.timesheet;
            this.client = data.timesheet.client;
        });
    }

    showCalculator(duration) {
        this._calculator.show(duration);
    }

    sendByEmail() {
        this._clientResource.sendTimeSheet(this._stateParams.clientId, this.range);
    }
}

export default ClientTimeSheetController;
