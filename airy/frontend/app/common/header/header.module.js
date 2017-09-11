import airyBreadcrumbs from 'common/header/breadcrumbs.service.js';
import airyHeader from 'common/header/header.component.js';

export default angular.module('airy.header', [])
    .service('airyBreadcrumbs', airyBreadcrumbs)
    .component('airyHeader', airyHeader);
