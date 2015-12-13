(function () {
    'use strict';

    angular
        .module('airy.footer')
        .directive('airyFooter', airyFooter);

    function airyFooter(airyUser) {
        return {
            restrict: 'A',
            templateUrl: 'static/partials/footer.html',
            scope: {},
            link: function (scope, element) {
                scope.user = airyUser.user;
                scope.logoutUser = airyUser.logout;
            },
        };
    }
})();
