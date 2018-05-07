import { TIMEZONE, PERIODS } from 'reports/client_report.controller.js';

class ClientTimeSheetController {

    constructor($scope, $stateParams, $rootScope, airyBreadcrumbs,
                clientResource, calculator) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._breadcrumbs = airyBreadcrumbs;
        this._clientResource = clientResource;
        this._calculator = calculator;

        this.timesheet = {};
        this.client = {};
        this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.range = {
            beg: moment().tz(TIMEZONE).startOf('isoWeek').format(),
            end: moment().tz(TIMEZONE).endOf('isoWeek').format(),
        };
        this.period = PERIODS[0];

        $scope.$watch('$ctrl.range', () => this.getTimeSheet(), true);
    }

    getTimeSheet() {
        this._clientResource.getTimeSheet(this._stateParams.clientId, this.range).then(response => {
            let data = response.data;
            this._rootScope.title = data.timesheet.client.name + ' :: Timesheet';
            this._breadcrumbs.add({
                label: data.timesheet.client.name,
                state: 'client_detail',
                params: {clientId: data.timesheet.client.id},
            }, {
                label: 'Timesheet',
            });
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
