import { airyBreadcrumbs } from './breadcrumbs.service.js';
import { airyHeader } from './header.component.js';

export default angular.module('airy.header', [])
    .service('airyBreadcrumbs', airyBreadcrumbs)
    .component('airyHeader', airyHeader);
