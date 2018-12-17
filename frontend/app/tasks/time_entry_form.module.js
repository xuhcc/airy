import { TimeEntryCreationController } from './time_entry_form.creation.controller.js';
import { TimeEntryUpdateController } from './time_entry_form.update.controller.js';
import { TimeEntryDurationFactory } from './time_entry_form.duration.service.js';

export default angular.module('airy.timeEntryForm', [])
    .controller('TimeEntryCreationController', TimeEntryCreationController)
    .controller('TimeEntryUpdateController', TimeEntryUpdateController)
    .factory('TimeEntryDuration', TimeEntryDurationFactory);
