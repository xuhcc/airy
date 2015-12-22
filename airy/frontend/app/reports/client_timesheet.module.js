import ClientTimeSheetCtrl from 'reports/client_timesheet.controller.js';
import 'reports/calculator.module.js';
import 'reports/range_selector.module.js';

export default angular.module('airy.clientTimeSheet', [])
    .controller('ClientTimeSheetCtrl', ClientTimeSheetCtrl);
