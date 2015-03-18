(function () {
    'use strict';

    angular
        .module('airyDirectives', [])
        .directive('airyHeader', airyHeader)
        .directive('airyFooter', airyFooter)
        .directive('taskStatusWidget', taskStatusWidget)
        .directive('autoFocus', autoFocus);

    function airyHeader(airyUser) {
        return {
            restrict: 'A',
            templateUrl: 'static/partials/header.html',
            scope: {},
            link: function (scope, element) {
                scope.user = airyUser.user;
                scope.logoutUser = airyUser.logout;
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
            }
        };
    }

    function taskStatusWidget($document) {
        return {
            restrict: 'A',
            template: '\
                <a title="Change status" data-ng-click="showMenu($event)">{{ task.status }}</a>\
                <div class="task-status-menu" data-ng-show="menuVisible" data-ng-style="menuPosition">\
                    <ul>\
                        <li data-ng-repeat="status in statuses">\
                            <a data-ng-click="setStatus(task, status)">{{ status }}</a>\
                        </li>\
                    </ul>\
                </div>',
            scope: {
                task: '=',
                setTaskStatus: '=set'
            },
            link: function (scope, element) {
                scope.menuVisible = false;
                scope.statuses = ['open', 'completed', 'closed'];
                scope.showMenu = function (event) {
                    var rect = event.target.getBoundingClientRect();
                    scope.menuPosition = {
                        left: parseInt(rect.left) + 'px',
                        top: parseInt(rect.top) + 'px'
                    };
                    scope.menuVisible = true;
                };
                scope.setStatus = function (task, status) {
                    scope.setTaskStatus(task, status);
                    scope.menuVisible = false;
                };

                $document.bind('mouseup', function (event) {
                    if ($(element).has(event.target).length > 0) {
                        return;
                    }
                    scope.menuVisible = false;
                    scope.$apply();
                });
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
})();
