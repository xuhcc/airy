import { clientResource } from './client_resource.service.js';
import { projectResource } from './project_resource.service.js';
import { taskResource } from './task_resource.service.js';
import { timeEntryResource } from './time_entry_resource.service.js';

export default angular.module('airy.resources', [])
    .service('clientResource', clientResource)
    .service('projectResource', projectResource)
    .service('taskResource', taskResource)
    .service('timeEntryResource', timeEntryResource);
