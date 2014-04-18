var Clients = (function () {
    'use strict';
    var showClientForm = function (data) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: $('.client-form-popup').clone()
            },
            focus: '[name="name"]',
            callbacks: {
                open: function () {
                    var popup = this.content;
                    if (!data.id) {
                        popup.find('legend').text('New client');
                        data.id = 0;
                    } else {
                        popup.find('legend').text('Client #' + data.id);
                        popup.find('[name="name"]').val(data.name);
                        popup.find('[name="contacts"]').val(data.contacts);
                    }
                    popup.find('.client-form').data('client-id', data.id);
                    popup.show();
                    popup.find('textarea').autosize();
                }
            }
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
            var client = $(this).closest('.client');
            var clientData = {
                id: client.data('client-id'),
                name: client.find('.client-name a').text(),
                contacts: client.find('.client-contacts').textMultiline()
            };
            showClientForm(clientData);
        });
        $('.client-add').on('click', function () {
            showClientForm({});
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
