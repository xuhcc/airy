import ClientReportController from 'reports/client_report.controller.js';
import calculatorModule from 'reports/calculator.module.js';
import rangeSelectorModule from 'reports/range_selector.module.js';

export default angular.module('airy.clientReport', [
    calculatorModule.name,
    rangeSelectorModule.name,
]).component('clientReport', {
    templateUrl: 'partials/client_report.html',
    controller: ClientReportController,
});
