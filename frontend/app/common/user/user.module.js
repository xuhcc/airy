import airyUser from 'common/user/user.service.js';

export default angular.module('airy.user', [])
    .factory('airyUser', airyUser);
