function AiryHeaderController(airyUser) {
    this.user = airyUser.user;
    this.logoutUser = airyUser.logout;
}

const airyHeader = {
    templateUrl: 'static/partials/header.html',
    controller: AiryHeaderController,
};

export default airyHeader;
