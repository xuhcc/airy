function airyHeader() {
    let directive = {
        restrict: 'A',
        templateUrl: 'static/partials/header.html',
        scope: {},
        controller: controller,
        controllerAs: 'ctrl',
    };
    return directive;

    function controller(airyUser) {
        this.user = airyUser.user;
    }
}

export default airyHeader;
