var Projects = (function () {
    'use strict';
    var showProjectForm = function (projectID) {
        $.ajax({
            type: 'GET',
            url: '/project/' + projectID
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
    var saveProject = function (form) {
        var projectID = form.data('project-id');
        var formData = {
            name: form.find('[name="name"]').val(),
            description: form.find('[name="description"]').val(),
            client_id: $('.current-client').data('client-id')
        };
        $.ajax({
            type: 'POST',
            url: '/project/' + projectID,
            data: formData
        }).done(function (data) {
            if (data.error_msg) {
                form.find('.form-message').text(data.error_msg);
                return;
            }
            if (data.new_) {
                $('.projects').append(data.html);
            } else {
                $('.project[data-project-id="' + projectID + '"]')
                    .replaceWith(data.html);
            }
            $.magnificPopup.close();
        });
    };
    var deleteProject = function (project) {
        var projectID = project.data('project-id');
        $.ajax({
            type: 'DELETE',
            url: '/project/' + projectID
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            project.remove();
        });
    };
    var init = function () {
        $(document).on('click', '.project-edit', function () {
            var projectID = $(this).closest('.project').data('project-id');
            showProjectForm(projectID);
        });
        $('.project-add').on('click', function () {
            showProjectForm(0);
        });
        $(document).on('keydown', null, 'alt+a', function (event) {
            event.preventDefault();
            showProjectForm(0);
        });
        $(document).on('submit', '.project-form', function (event) {
            event.preventDefault();
            saveProject($(this));
        });
        $(document).on('click', '.project-delete', function () {
            var project = $(this).closest('.project');
            Base.confirm('Delete project?', function () {
                deleteProject(project);
            });
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Projects.init();
});
