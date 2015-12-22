import clientResource from 'resources/client_resource.service.js';
import projectResource from 'resources/project_resource.service.js';
import taskResource from 'resources/task_resource.service.js';
import timeEntryResource from 'resources/time_entry_resource.service.js';

export default angular.module('airy.resources', [])
    .factory('clientResource', clientResource)
    .factory('projectResource', projectResource)
    .factory('taskResource', taskResource)
    .factory('timeEntryResource', timeEntryResource);
