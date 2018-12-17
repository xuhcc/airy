import { airyUser } from './user.service.js';

export default angular.module('airy.user', [])
    .factory('airyUser', airyUser);
