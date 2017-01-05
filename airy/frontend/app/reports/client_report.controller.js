class ClientReportController {

    constructor($scope, $stateParams, $rootScope, clientResource, calculator) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._clientResource = clientResource;
        this._calculator = calculator;

        this.report = {};
        this.client = {};
        this.periods = [
            {
                label: '1 week',
                getRangeEnd: (rangeBeg) => {
                    return moment(rangeBeg).endOf('isoWeek').format();
                },
            },
            {
                label: '2 weeks',
                getRangeEnd: (rangeBeg) => {
                    return moment(rangeBeg).add(1, 'week').endOf('isoWeek').format();
                },
            },
            {
                label: '4 weeks',
                getRangeEnd: (rangeBeg) => {
                    return moment(rangeBeg).add(3, 'week').endOf('isoWeek').format();
                },
            },
        ];
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
        this.range.end = this.period.getRangeEnd(this.range.beg);
    }

    showCalculator(duration) {
        this._calculator.show(duration);
    }

    sendByEmail() {
        this._clientResource.sendReport(this._stateParams.clientId, this.range);
    }
}

export default ClientReportController;
