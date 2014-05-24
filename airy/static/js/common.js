var Base = (function () {
    'use strict';
    var alertTemplate = $('<div class="popup">\
        <div class="alert">\
        <div class="alert-message"></div>\
        <button class="pure-button">OK</button>\
        </div></div>');
    var confirmTemplate = $('<div class="popup">\
        <div class="confirm">\
        <div class="confirm-message"></div>\
        <button class="pure-button" data-choice="yes">Yes</button>\
        <button class="pure-button" data-choice="no">No</button>\
        </div></div>');
    var alert = function (message) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: alertTemplate.clone(),
            },
            modal: true,
            callbacks: {
                open: function () {
                    var popup = this.content;
                    popup.find('.alert-message').text(message);
                    popup.find('button').off('click').on('click', function () {
                        $.magnificPopup.close();
                    });
                }
            }
        });
    };
    var confirm = function (message, confirmCallback) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: confirmTemplate.clone(),
            },
            modal: true,
            callbacks: {
                open: function () {
                    var popup = this.content;
                    popup.find('.confirm-message').text(message);
                    popup.find('button').off('click').on('click', function () {
                        $.magnificPopup.close();
                        if ($(this).data('choice') == 'yes') {
                            confirmCallback();
                        }
                    });
                }
            }
        });
    };
    var init = function () {
        $.magnificPopup.instance._onFocusIn = function (e) {
            // Firefox Alt+Shift fix
            if (e.target === document) {
                return true;
            }
            $.magnificPopup.proto._onFocusIn.call(this,e);
        };
    };
    return {
        init: init,
        alert: alert,
        confirm: confirm
    };
}());
