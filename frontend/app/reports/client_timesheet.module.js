import { ClientTimeSheetController } from './client_timesheet.controller.js';
import calculatorModule from './calculator.module.js';
import rangeSelectorModule from './range_selector.module.js';

export default angular.module('airy.clientTimeSheet', [
    calculatorModule.name,
    rangeSelectorModule.name,
]).component('clientTimeSheet', {
    templateUrl: 'partials/client_timesheet.html',
    controller: ClientTimeSheetController,
});
