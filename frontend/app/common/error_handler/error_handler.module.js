import httpErrorHandler from 'common/error_handler/error_handler.service.js';

export default angular.module('airy.errorHandler', [])
     .factory('httpErrorHandler', httpErrorHandler);
