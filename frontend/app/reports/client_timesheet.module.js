import ClientTimeSheetController from 'reports/client_timesheet.controller.js';
import 'reports/calculator.module.js';
import 'reports/range_selector.module.js';

export default angular.module('airy.clientTimeSheet', [])
    .component('clientTimeSheet', {
        templateUrl: 'partials/client_timesheet.html',
        controller: ClientTimeSheetController,
    });
