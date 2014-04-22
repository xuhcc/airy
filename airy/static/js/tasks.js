var Tasks = (function () {
    'use strict';
    var showTaskForm = function (data) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: $('.task-form-template').clone()
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
                    popup.removeClass('task-form-template');
                    popup.find('textarea').autosize();
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
    var statusMenuTemplate = $('<div class="task-status-menu"><ul>\
        <li><a>open</a></li>\
        <li><a>completed</a></li>\
        <li><a>closed</a></li>\
        </ul></div>');
    var showStatusMenu = function (task) {
        var position = task.find('.task-status a').offset();
        var menu = statusMenuTemplate.clone().css(position);
        task.append(menu);
    };
    var changeStatus = function(task, status) {
        var taskID = task.data('task-id');
        $.ajax({
            type: 'POST',
            url: '/task/' + taskID + '/status',
            data: {
                status: status,
            }
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            var statusElem = task.find('.task-status a');
            task.removeClass('task-' + statusElem.text())
                .addClass('task-' + status);
            statusElem.text(status);
        });
    };
    var showTimeEntryForm = function (data) {
        $.magnificPopup.open({
            type: 'inline',
            items: {
                src: $('.time-entry-form-template').clone()
            },
            focus: '[name="amount"]',
            callbacks: {
                open: function () {
                    var popup = this.content;
                    if (!data.id) {
                        data.id = 0;
                    } else {
                        popup.find('[name="amount"]').val(data.amount);
                        popup.find('[name="comment"]').val(data.comment);
                    }
                    popup.find('legend').text('Task #' + data.task_id);
                    popup.find('.time-entry-form').data('task-id', data.task_id);
                    popup.find('.time-entry-form').data('time-entry-id', data.id);
                    popup.removeClass('time-entry-form-template');
                    popup.find('textarea').autosize();
                }
            }
        });
    };
    var saveTimeEntry = function (form) {
        var timeEntryID = form.data('time-entry-id');
        var formData = {
            amount: form.find('[name="amount"]').val(),
            comment: form.find('[name="comment"]').val(),
            task_id: form.data('task-id')
        };
        $.ajax({
            type: 'POST',
            url: '/time-entry/' + timeEntryID,
            data: formData
        }).done(function (data) {
            if (data.error_msg) {
                form.find('.form-message').text(data.error_msg);
                return;
            }
            var task = $('.task[data-task-id="' + formData.task_id + '"]');
            if (data.new_) {
                task.find('.task-time-entries ul').append(data.html);
            } else {
                $('.time-entry[data-time-entry-id="' + timeEntryID + '"]')
                    .replaceWith(data.html);
            }
            task.find('.task-spent-time a').text(data.total.toFixed(2));
            $.magnificPopup.close();
        });
    };
    var init = function () {
        $(document).on('click', '.task-edit', function () {
            var task = $(this).closest('.task');
            var taskData = {
                id: task.data('task-id'),
                title: task.find('.task-title h3').text(),
                description: task.find('.task-description').textMultiline()
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
        $(document).on('click', '.task-status a', function () {
            var task = $(this).closest('.task');
            showStatusMenu(task);
        });
        $(document).mouseup(function (event) {
            // Hide menus
            var menus = $('.task-status-menu');
            if (menus.has(event.target).length === 0) {
                menus.remove();
            }
        });
        $(document).on('click', '.task-status-menu a', function () {
            var task = $(this).closest('.task');
            var status = $(this).text();
            changeStatus(task, status);
            $(this).closest('.task-status-menu').remove();
        });
        $(document).on('click', '.task-spent-time a', function () {
            $(this).closest('.task').find('.task-time-entries').toggle();
        });
        $(document).on('click', '.time-entry a', function () {
            var timeEntry = $(this).closest('.time-entry');
            var timeEntryData = {
                id: timeEntry.data('time-entry-id'),
                amount: timeEntry.find('.time-entry-amount').text(),
                comment: timeEntry.find('.time-entry-comment').textMultiline(),
                task_id: timeEntry.closest('.task').data('task-id')
            };
            showTimeEntryForm(timeEntryData);
        });
        $(document).on('click', '.task-add-time-entry', function () {
            showTimeEntryForm({
                task_id: $(this).closest('.task').data('task-id')
            });
        });
        $(document).on('submit', '.time-entry-form', function (event) {
            event.preventDefault();
            saveTimeEntry($(this));
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Tasks.init();
});
