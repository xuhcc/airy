var airyDirectives = angular.module('airyDirectives', []);

airyDirectives.directive('airyHeader', function () {
    return {
        restrict: 'A',
        templateUrl: 'static/partials/header.html'
    };
});

airyDirectives.directive('airyFooter', function () {
    return {
        restrict: 'A',
        templateUrl: 'static/partials/footer.html',
        controller: function ($scope, $http) {
            $http.get('api/user').success(function (data) {
                $scope.user = data.user;
            });
        }
    };
});
