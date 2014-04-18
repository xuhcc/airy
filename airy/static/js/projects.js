var Projects = (function () {
    'use strict';
    var showProjectForm = function (data) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: $('.project-form-popup').clone()
            },
            focus: '[name="name"]',
            callbacks: {
                open: function () {
                    var popup = this.content;
                    if (!data.id) {
                        popup.find('legend').text('New project');
                        data.id = 0;
                    } else {
                        popup.find('legend').text('Project #' + data.id);
                        popup.find('[name="name"]').val(data.name);
                        popup.find('[name="description"]').val(data.description);
                    }
                    popup.find('.project-form').data('project-id', data.id);
                    popup.show();
                    popup.find('textarea').autosize();
                }
            }
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
            var project = $(this).closest('.project');
            var projectData = {
                id: project.data('project-id'),
                name: project.find('.project-name a').text(),
                description: project.find('.project-description').textMultiline()
            };
            showProjectForm(projectData);
        });
        $('.project-add').on('click', function () {
            showProjectForm({});
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
