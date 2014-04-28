var Clients = (function () {
    'use strict';
    var showClientForm = function (clientID) {
        $.ajax({
            type: 'GET',
            url: '/client/' + clientID
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            var popup = $('<div/>', {class: 'popup'}).html(data.html);
            $.magnificPopup.open({
                type: 'inline',
                items: {
                    src: popup
                },
                focus: '[name="name"]',
                callbacks: {
                    open: function () {
                        this.content.find('textarea').autosize();
                    }
                }
            });
        });
    };
    var saveClient = function (form) {
        var clientID = form.data('client-id');
        var formData = {
            name: form.find('[name="name"]').val(),
            contacts: form.find('[name="contacts"]').val()
        };
        $.ajax({
            type: 'POST',
            url: '/client/' + clientID,
            data: formData
        }).done(function (data) {
            if (data.error_msg) {
                form.find('.form-message').text(data.error_msg);
                return;
            }
            if (data.new_) {
                $('.clients').append(data.html);
            } else {
                $('.client[data-client-id="' + clientID + '"]')
                    .replaceWith(data.html);
            }
            $.magnificPopup.close();
        });
    };
    var deleteClient = function (client) {
        var clientID = client.data('client-id');
        $.ajax({
            type: 'DELETE',
            url: '/client/' + clientID
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            client.remove();
        });
    };
    var init = function () {
        $(document).on('click', '.client-edit', function () {
            var clientID = $(this).closest('.client').data('client-id');
            showClientForm(clientID);
        });
        $('.client-add').on('click', function () {
            showClientForm(0);
        });
        $(document).on('keydown', null, 'alt+a', function (event) {
            event.preventDefault();
            showClientForm(0);
        });
        $(document).on('submit', '.client-form', function (event) {
            event.preventDefault();
            saveClient($(this));
        });
        $(document).on('click', '.client-delete', function () {
            var client = $(this).closest('.client');
            Base.confirm('Delete client?', function () {
                deleteClient(client);
            });
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Clients.init();
});
