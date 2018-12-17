export const TIMEZONE = 'Europe/Moscow';

export const PERIODS = [
    {
        label: '1 week',
        updateRange: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).startOf('isoWeek').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('isoWeek').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).subtract(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('isoWeek').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).add(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('isoWeek').format();
        },
    },
    {
        label: '2 weeks',
        updateRange: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).startOf('isoWeek').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(1, 'week').endOf('isoWeek').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).subtract(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(1, 'week').endOf('isoWeek').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).add(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(1, 'week').endOf('isoWeek').format();
        },
    },
    {
        label: '4 weeks',
        updateRange: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).startOf('isoWeek').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(3, 'week').endOf('isoWeek').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).subtract(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(3, 'week').endOf('isoWeek').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).add(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(3, 'week').endOf('isoWeek').format();
        },
    },
    {
        label: '8 weeks',
        updateRange: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).startOf('isoWeek').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(7, 'week').endOf('isoWeek').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).subtract(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(7, 'week').endOf('isoWeek').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).add(1, 'week').format();
            range.end = moment(range.beg).tz(TIMEZONE).add(7, 'week').endOf('isoWeek').format();
        },
    },
    {
        label: '1 month',
        updateRange: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).startOf('month').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('month').format();
        },
        shiftBack: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).subtract(1, 'month').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('month').format();
        },
        shiftForward: (range) => {
            range.beg = moment(range.beg).tz(TIMEZONE).add(1, 'month').format();
            range.end = moment(range.beg).tz(TIMEZONE).endOf('month').format();
        },
    },
];


export class ClientReportController {

    constructor(
        $scope, $stateParams, $rootScope, airyBreadcrumbs,
        clientResource, calculator
    ) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._breadcrumbs = airyBreadcrumbs;
        this._clientResource = clientResource;
        this._calculator = calculator;

        this.report = {};
        this.client = {};
        this.periods = PERIODS;
        this.period = this.periods[0];

        this.range = {
            beg: moment().tz(TIMEZONE).startOf('isoWeek').format(),
            end: moment().tz(TIMEZONE).endOf('isoWeek').format(),
        };

        $scope.$watch('$ctrl.range', () => this.getReport(), true);
    }

    getReport() {
        this._clientResource.getReport(this._stateParams.clientId, this.range).then(response => {
            let data = response.data;
            this._rootScope.title = data.report.client.name + ' :: Task report';
            this._breadcrumbs.add({
                label: data.report.client.name,
                state: 'client_detail',
                params: {clientId: data.report.client.id},
            }, {
                label: 'Task report',
            });
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
