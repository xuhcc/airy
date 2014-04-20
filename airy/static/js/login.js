var Login = (function () {
    'use strict';
    var init = function () {
        $('.login').on('submit', function (event) {
            event.preventDefault();
            var passwordField = $(this).find('[name="password"]');
            $.ajax({
                type: 'POST',
                url: '/login',
                data: {
                    password: passwordField.val()
                }
            }).done(function (data) {
                if (data.code === 0) {
                    window.location.href = '/clients';
                } else {
                    passwordField[0].setCustomValidity('Incorrect password');
                    passwordField.focus();
                }
            });
        });
        $('.login [name="password"]').on('input', function () {
            $(this)[0].setCustomValidity('');
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Login.init();
});
