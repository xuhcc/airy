function airyFooter(airyUser) {
    let directive = {
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

export default airyFooter;
