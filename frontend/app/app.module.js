import { routeConfig } from 'app.routes.js';
import { httpConfig, ngDialogConfig } from 'app.configs.js';

import autosizeModule from 'common/autosize/autosize.module.js';
import errorHandlerModule from 'common/error_handler/error_handler.module.js';
import headerModule from 'common/header/header.module.js';
import popupModule from 'common/popup/popup.module.js';
import userModule from 'common/user/user.module.js';
import filtersModule from 'common/filters.module.js';
import resourcesModule from 'resources/resources.module.js';
import loginModule from 'login/login.module.js';
import clientDetailModule from 'clients/client_detail.module.js';
import clientFormModule from 'clients/client_form.module.js';
import clientListModule from 'clients/client_list.module.js';
import projectDetailModule from 'projects/project_detail.module.js';
import projectFormModule from 'projects/project_form.module.js';
import taskFormModule from 'tasks/task_form.module.js';
import timeEntryFormModule from 'tasks/time_entry_form.module.js';
import clientReportModule from 'reports/client_report.module.js';
import clientTimeSheetModule from 'reports/client_timesheet.module.js';

angular
    .module('airy', [
        'ngSanitize',
        'ngDialog',
        'cfp.hotkeys',
        'angular-loading-bar',
        'ui.router',
        // Application
        filtersModule.name,
        resourcesModule.name,
        autosizeModule.name,
        errorHandlerModule.name,
        headerModule.name,
        popupModule.name,
        userModule.name,
        loginModule.name,
        clientListModule.name,
        clientFormModule.name,
        clientDetailModule.name,
        projectFormModule.name,
        projectDetailModule.name,
        taskFormModule.name,
        timeEntryFormModule.name,
        clientTimeSheetModule.name,
        clientReportModule.name,
    ])
    .config(routeConfig)
    .config(httpConfig)
    .config(ngDialogConfig);

angular.bootstrap(document.documentElement, ['airy']);
