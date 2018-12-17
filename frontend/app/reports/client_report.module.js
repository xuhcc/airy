import { ClientReportController } from './client_report.controller.js';
import calculatorModule from './calculator.module.js';
import rangeSelectorModule from './range_selector.module.js';

export default angular.module('airy.clientReport', [
    calculatorModule.name,
    rangeSelectorModule.name,
]).component('clientReport', {
    templateUrl: 'partials/client_report.html',
    controller: ClientReportController,
});
