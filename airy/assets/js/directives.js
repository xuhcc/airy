(function () {
    'use strict';

    angular
        .module('airyDirectives', [])
        .directive('airyHeader', airyHeader)
        .directive('airyFooter', airyFooter)
        .directive('autoFocus', autoFocus)
        .directive('weekSelector', weekSelector);

    function airyHeader(airyUser) {
        return {
            restrict: 'A',
            templateUrl: 'static/partials/header.html',
            scope: {},
            link: function (scope, element) {
                scope.user = airyUser.user;
            }
        };
    }

    function airyFooter(airyUser) {
        return {
            restrict: 'A',
            templateUrl: 'static/partials/footer.html',
            scope: {},
            link: function (scope, element) {
                scope.user = airyUser.user;
                scope.logoutUser = airyUser.logout;
            }
        };
    }

    function autoFocus($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                }, 10);
            }
        };
    }

    function weekSelector() {
        return {
            restrict: 'A',
            template: '\
                <a class="shift-back icon" ng-click="shiftBack()">l</a>\
                <span>{{ getRange() }}</span>\
                <a class="shift-forward icon" ng-click="shiftForward()">r</a>\
            ',
            scope: {
                weekBeg: '='
            },
            link: function (scope, element) {
                scope.getRange = function () {
                    var weekBeg = moment(scope.weekBeg);
                    var weekEnd = moment(weekBeg).endOf('isoWeek');
                    return weekBeg.format('DD.MM.YY') + ' — ' + weekEnd.format('DD.MM.YY');
                };

                scope.shiftBack = function () {
                    var weekBeg = moment(scope.weekBeg);
                    scope.weekBeg = weekBeg.subtract(1, 'week').format();
                };

                scope.shiftForward = function () {
                    var weekBeg = moment(scope.weekBeg);
                    scope.weekBeg = weekBeg.add(1, 'week').format();
                };
            }
        };
    }
})();
