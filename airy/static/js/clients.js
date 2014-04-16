var Clients = (function () {
    'use strict';
    var showClientForm = function (data) {
        $.magnificPopup.open({
            items: {
                src: '.client-form-popup',
                type: 'inline'
            },
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
                    popup.find('[name="name"]').focus();
                }
            }
        });
    };
    var init = function () {
        $(document).on('click', '.client-edit', function () {
            var client = $(this).closest('.client');
            var clientData = {
                id: client.data('client-id'),
                name: client.find('.client-name a').text(),
                contacts: client.find('.client-contacts').text()
            };
            showClientForm(clientData);
        });
        $('.client-add').on('click', function () {
            showClientForm({});
        });
        $(document).on('click', '.client-delete', function () {
            var client = $(this).closest('.client');
            var clientID = client.data('client-id');
            $.ajax({
                type: 'DELETE',
                url: '/client/' + clientID
            }).done(function (data) {
                if (data.error_msg) {
                    alert(data.error_msg);
                    return;
                }
                client.remove();
            });
        });
        $(document).on('submit', '.client-form', function (event) {
            event.preventDefault();
            var form = $(this);
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
                    alert(data.error_msg);
                    return;
                }
                if (data._new) {
                    $('.clients').append(data.html);
                } else {
                    $('.client[data-client-id="' + clientID + '"]')
                        .replaceWith(data.html);
                }
                form.parent().magnificPopup('close');
            });
        });
    };
    return {init: init};
}());

$(function () {
    Clients.init();
});
