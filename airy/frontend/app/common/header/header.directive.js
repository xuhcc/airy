function airyHeader(airyUser) {
    let directive = {
        restrict: 'A',
        templateUrl: 'static/partials/header.html',
        scope: {},
        link: link,
    };
    return directive;

    function link(scope, element) {
        scope.user = airyUser.user;
    }
}

export default airyHeader;
