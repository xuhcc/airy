import clientResource from 'resources/client_resource.service.js';
import projectResource from 'resources/project_resource.service.js';
import taskResource from 'resources/task_resource.service.js';
import timeEntryResource from 'resources/time_entry_resource.service.js';

export default angular.module('airy.resources', [])
    .service('clientResource', clientResource)
    .service('projectResource', projectResource)
    .service('taskResource', taskResource)
    .service('timeEntryResource', timeEntryResource);
