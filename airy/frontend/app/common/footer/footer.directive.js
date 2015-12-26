function airyFooter() {
    let directive = {
        restrict: 'A',
        templateUrl: 'static/partials/footer.html',
        scope: {},
        controller: controller,
        controllerAs: 'ctrl',
    };
    return directive;

    function controller(airyUser) {
        this.user = airyUser.user;
        this.logoutUser = airyUser.logout;
    }
}

export default airyFooter;
