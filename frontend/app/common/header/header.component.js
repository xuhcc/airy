function AiryHeaderController(airyUser, airyBreadcrumbs) {
    this.user = airyUser.user;
    this.logoutUser = airyUser.logout;
    this.breadcrumbs = airyBreadcrumbs;
}

export const airyHeader = {
    templateUrl: 'partials/header.html',
    controller: AiryHeaderController,
};
