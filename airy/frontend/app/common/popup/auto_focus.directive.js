function autoFocus($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element[0].focus();
            }, 10);
        },
    };
}

export default autoFocus;
