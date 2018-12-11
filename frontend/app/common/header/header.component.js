function AiryHeaderController(airyUser, airyBreadcrumbs) {
    this.user = airyUser.user;
    this.logoutUser = airyUser.logout;
    this.breadcrumbs = airyBreadcrumbs;
}

const airyHeader = {
    templateUrl: 'partials/header.html',
    controller: AiryHeaderController,
};

export default airyHeader;
