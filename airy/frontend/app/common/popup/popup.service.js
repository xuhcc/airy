function airyPopup(ngDialog) {
    let service = {
        alert: showAlert,
        confirm: showConfirm,
    };
    return service;

    function showAlert(message) {
        const template = '\
            <div class="alert">\
                <div class="alert-message">{{ ngDialogData.message }}</div>\
                <button class="pure-button" ng-click="closeThisDialog()">OK</button>\
            </div>';
        ngDialog.open({
            template: template,
            plain: true,
            data: {message: message},
        });
    }

    function showConfirm(message, confirmCallback) {
        const template = '\
            <div class="confirm">\
                <div class="confirm-message">{{ ngDialogData.message }}</div>\
                <button class="pure-button" ng-click="confirm(1)">Yes</button>\
                <button class="pure-button" ng-click="closeThisDialog(0)">No</button>\
            </div>';
        ngDialog.openConfirm({
            template: template,
            plain: true,
            data: {message: message},
        }).then(function (data) {
            if (data === 1) {
                confirmCallback();
            }
        });
    }
}

export default airyPopup;
