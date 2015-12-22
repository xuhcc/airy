import airyPopup from 'common/popup/popup.service.js';
import autoFocus from 'common/popup/auto_focus.directive.js';

export default angular.module('airy.popup', [])
    .factory('airyPopup', airyPopup)
    .directive('autoFocus', autoFocus);
