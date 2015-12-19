(function () {
    'use strict';

    angular
        .module('airy.footer')
        .directive('airyFooter', airyFooter);

    function airyFooter(airyUser) {
        var directive = {
            restrict: 'A',
            templateUrl: 'static/partials/footer.html',
            scope: {},
            link: link,
        };
        return directive;

        function link(scope, element) {
            scope.user = airyUser.user;
            scope.logoutUser = airyUser.logout;
        }
    }
})();
