function AiryFooterController(airyUser) {
    this.user = airyUser.user;
    this.logoutUser = airyUser.logout;
}

const airyFooter = {
    templateUrl: 'static/partials/footer.html',
    controller: AiryFooterController,
};

export default airyFooter;
