import ClientReportController from 'reports/client_report.controller.js';
import 'reports/calculator.module.js';
import 'reports/range_selector.module.js';

export default angular.module('airy.clientReport', [])
    .controller('ClientReportController', ClientReportController);
