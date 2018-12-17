import { httpErrorHandler } from './error_handler.service.js';

export default angular.module('airy.errorHandler', [])
    .factory('httpErrorHandler', httpErrorHandler);
