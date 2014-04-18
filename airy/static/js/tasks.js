var Tasks = (function () {
    'use strict';
    var showTaskForm = function (data) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: '.task-form-popup'
            },
            focus: '[name="title"]',
            callbacks: {
                open: function () {
                    var popup = this.content;
                    if (!data.id) {
                        popup.find('legend').text('New task');
                        data.id = 0;
                    } else {
                        popup.find('legend').text('Task #' + data.id);
                        popup.find('[name="title"]').val(data.title);
                        popup.find('[name="description"]').val(data.description);
                    }
                    popup.find('.task-form').data('task-id', data.id);
                    popup.show();
                }
            }
        });
    };
    var saveTask = function (form) {
        var taskID = form.data('task-id');
        var formData = {
            title: form.find('[name="title"]').val(),
            description: form.find('[name="description"]').val(),
            project_id: $('.current-project').data('project-id')
        };
        $.ajax({
            type: 'POST',
            url: '/task/' + taskID,
            data: formData
        }).done(function (data) {
            if (data.error_msg) {
                form.find('.form-message').text(data.error_msg);
                return;
            }
            if (data.new_) {
                $('.tasks').append(data.html);
            } else {
                $('.task[data-task-id="' + taskID + '"]')
                    .replaceWith(data.html);
            }
            $.magnificPopup.close();
        });
    };
    var deleteTask = function (task) {
        var taskID = task.data('task-id');
        $.ajax({
            type: 'DELETE',
            url: '/task/' + taskID
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            task.remove();
        });
    };
    var init = function () {
        $(document).on('click', '.task-edit', function () {
            var task = $(this).closest('.task');
            var taskData = {
                id: task.data('task-id'),
                title: task.find('.task-title').text(),
                description: task.find('.task-description').text()
            };
            showTaskForm(taskData);
        });
        $('.task-add').on('click', function () {
            showTaskForm({});
        });
        $(document).on('submit', '.task-form', function (event) {
            event.preventDefault();
            saveTask($(this));
        });
        $(document).on('click', '.task-delete', function () {
            var task = $(this).closest('.task');
            Base.confirm('Delete task?', function () {
                deleteTask(task);
            });
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Tasks.init();
});
