import routeConfig from 'app.routes.js';
import {httpConfig, ngDialogConfig} from 'app.configs.js';

import 'common/autosize/autosize.module.js';
import 'common/error_handler/error_handler.module.js';
import 'common/header/header.module.js';
import 'common/popup/popup.module.js';
import 'common/user/user.module.js';
import 'common/filters.module.js';
import 'resources/resources.module.js';
import 'login/login.module.js';
import 'clients/client_detail.module.js';
import 'clients/client_form.module.js';
import 'clients/client_list.module.js';
import 'projects/project_detail.module.js';
import 'projects/project_form.module.js';
import 'tasks/task_form.module.js';
import 'tasks/time_entry_form.module.js';
import 'reports/client_report.module.js';
import 'reports/client_timesheet.module.js';

angular
    .module('airy', [
        'ngSanitize',
        'ngDialog',
        'cfp.hotkeys',
        'angular-loading-bar',
        'ui.router',
        // Application
        'airy.filters',
        'airy.resources',
        'airy.autosize',
        'airy.header',
        'airy.errorHandler',
        'airy.user',
        'airy.popup',
        'airy.login',
        'airy.clientList',
        'airy.clientForm',
        'airy.clientDetail',
        'airy.clientTimeSheet',
        'airy.clientReport',
        'airy.rangeSelector',
        'airy.calculator',
        'airy.projectForm',
        'airy.projectDetail',
        'airy.taskForm',
        'airy.timeEntryForm',
    ])
    .config(routeConfig)
    .config(httpConfig)
    .config(ngDialogConfig);

angular.bootstrap(document.documentElement, ['airy']);
