import ClientTimeSheetController from 'reports/client_timesheet.controller.js';
import calculatorModule from 'reports/calculator.module.js';
import rangeSelectorModule from 'reports/range_selector.module.js';

export default angular.module('airy.clientTimeSheet', [
    calculatorModule.name,
    rangeSelectorModule.name,
]).component('clientTimeSheet', {
    templateUrl: 'partials/client_timesheet.html',
    controller: ClientTimeSheetController,
});
