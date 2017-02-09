function shiftBackWeek(range) {
    range.beg = moment(range.beg).subtract(1, 'week').format();
    range.end = moment(range.beg).endOf('isoWeek').format();
}

function shiftForwardWeek(range) {
    range.beg = moment(range.beg).add(1, 'week').format();
    range.end = moment(range.beg).endOf('isoWeek').format();
}

export const PERIODS = [
    {
        label: '1 week',
        updateRange: (range) => {
            range.beg = moment(range.beg).startOf('isoWeek').format();
            range.end = moment(range.beg).endOf('isoWeek').format();
        },
        shiftBack: shiftBackWeek,
        shiftForward: shiftForwardWeek,
    },
    {
        label: '2 weeks',
        updateRange: (range) => {
            range.beg = moment(range.beg).startOf('isoWeek').format();
            range.end = moment(range.beg).add(1, 'week').endOf('isoWeek').format();
        },
        shiftBack: shiftBackWeek,
        shiftForward: shiftForwardWeek,
    },
    {
        label: '4 weeks',
        updateRange: (range) => {
            range.beg = moment(range.beg).startOf('isoWeek').format();
            range.end = moment(range.beg).add(3, 'week').endOf('isoWeek').format();
        },
        shiftBack: shiftBackWeek,
        shiftForward: shiftForwardWeek,
    },
    {
        label: '1 month',
        updateRange: (range) => {
            range.beg = moment(range.beg).startOf('month').format();
            range.end = moment(range.beg).endOf('month').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).subtract(1, 'month').format();
            range.end = moment(range.beg).endOf('month').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).add(1, 'month').format();
            range.end = moment(range.beg).endOf('month').format();
        },
    },
];


class ClientReportController {

    constructor($scope, $stateParams, $rootScope, clientResource, calculator) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._clientResource = clientResource;
        this._calculator = calculator;

        this.report = {};
        this.client = {};
        this.periods = PERIODS;
        this.period = this.periods[0];

        this.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format(),
        };

        $scope.$watch('$ctrl.range', () => this.getReport(), true);
    }

    getReport() {
        this._clientResource.getReport(this._stateParams.clientId, this.range).then(response => {
            let data = response.data;
            this._rootScope.title = data.report.client.name + ' :: Task report';
            // Fix for angular-breadcrumb
            this._rootScope.breadcrumbClient = data.report.client.name;
            this.report = data.report;
            this.client = data.report.client;
        });
    }

    setPeriod() {
        this.period.updateRange(this.range);
    }

    showCalculator(duration) {
        this._calculator.show(duration);
    }

    sendByEmail() {
        this._clientResource.sendReport(this._stateParams.clientId, this.range);
    }
}

export default ClientReportController;
