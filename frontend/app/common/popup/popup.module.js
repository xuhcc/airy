import { airyPopup } from './popup.service.js';
import { autoFocus } from './auto_focus.directive.js';

export default angular.module('airy.popup', [])
    .factory('airyPopup', airyPopup)
    .directive('autoFocus', autoFocus);
