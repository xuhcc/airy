function airyFooterController(airyUser) {
    this.user = airyUser.user;
    this.logoutUser = airyUser.logout;
}

const airyFooter = {
    templateUrl: 'static/partials/footer.html',
    controller: airyFooterController,
};

export default airyFooter;
