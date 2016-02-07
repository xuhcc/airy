function AiryHeaderController(airyUser) {
    this.user = airyUser.user;
}

const airyHeader = {
    templateUrl: 'static/partials/header.html',
    controller: AiryHeaderController,
};

export default airyHeader;
