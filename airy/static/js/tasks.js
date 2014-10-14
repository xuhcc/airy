var Tasks = (function () {
    'use strict';
    var showTaskForm = function (taskID) {
        $.ajax({
            type: 'GET',
            url: '/task/' + taskID
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
                focus: '[name="title"]',
                callbacks: {
                    open: function () {
                        this.content.find('textarea').autosize();
                    }
                }
            });
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
            $('.user-open-tasks').text(data.open_tasks);
        });
    };
    var showTimeEntryForm = function (timeEntryID, taskID, amount) {
        $.ajax({
            type: 'GET',
            url: '/time-entry/' + timeEntryID
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
                focus: '[name="amount"]',
                callbacks: {
                    open: function () {
                        var form = this.content.find('.time-entry-form');
                        if (timeEntryID === 0) {
                            form.data('task-id', taskID);
                            if (amount !== undefined) {
                                form.find('[name="amount"]').val(amount);
                            }
                        }
                        this.content.find('textarea').autosize();
                    }
                }
            });
        });
    };
    var toggleTimer = function (taskID) {
        var task = $('.task[data-task-id="' + taskID + '"]');
        var timer;
        var currentData = localStorage.getItem('timer');
        if (currentData === null) {
            // Start timer
            timer = {task_id: taskID, start: moment()};
            timer.interval_id = setInterval(function () {
                var amount = moment().diff(moment(timer.start), 'hours', true);
                task.find('.task-timer').show().text(amount.toFixed(4));
            }, 1000);
            localStorage.setItem('timer', JSON.stringify(timer));
        } else {
            // Stop timer
            localStorage.removeItem('timer');
            timer = JSON.parse(currentData);
            clearInterval(timer.interval_id);
            task.find('.task-timer').hide();
            var amount = moment().diff(moment(timer.start), 'hours', true);
            showTimeEntryForm(0, timer.task_id, amount.toFixed(2));
        }
    };
    var incrementTimeAmount = function (form) {
        var field = form.find('[name="amount"]');
        var newValue = parseFloat(field.val()) + 0.5;
        field.val(newValue.toFixed(2));
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
            task.find('.task-total-time').text(data.total.toFixed(2));
            task.find('.task-time-entries').show();
            $.magnificPopup.close();
            $('.user-total-today').text(data.total_today.toFixed(2));
            $('.user-total-week').text(data.total_week.toFixed(2));
        });
    };
    var deleteTimeEntry = function (timeEntry) {
        var timeEntryID = timeEntry.data('time-entry-id');
        $.ajax({
            type: 'DELETE',
            url: '/time-entry/' + timeEntryID
        }).done(function (data) {
            if (data.error_msg) {
                Base.alert(data.error_msg);
                return;
            }
            var task = timeEntry.closest('.task');
            timeEntry.remove();
            task.find('.task-total-time').text(data.total.toFixed(2));
            $('.user-total-today').text(data.total_today.toFixed(2));
            $('.user-total-week').text(data.total_week.toFixed(2));
        });
    };
    var init = function () {
        $(document).on('click', '.task-edit', function () {
            var taskID = $(this).closest('.task').data('task-id');
            showTaskForm(taskID);
        });
        $(document).on('click', '.task-add', function () {
            showTaskForm(0);
        });
        $(document).on('keydown', null, 'alt+a', function (event) {
            event.preventDefault();
            showTaskForm(0);
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
        $(document).on('click', '.task-title a', function () {
            var task = $(this).closest('.task');
            task.find('.task-created, .task-updated').toggle();
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
        $(document).on('click', '.task-total-time', function () {
            $(this).closest('.task').find('.task-time-entries').toggle();
        });
        $(document).on('mouseenter mouseleave', '.time-entry', function () {
            $(this).find('.time-entry-delete').toggle();
        });
        $(document).on('click', '.time-entry-amount, .time-entry-comment', function () {
            var timeEntry = $(this).closest('.time-entry');
            var timeEntryID = timeEntry.data('time-entry-id');
            var taskID = timeEntry.closest('.task').data('task-id');
            showTimeEntryForm(timeEntryID, taskID);
        });
        $(document).on('click', '.time-entry-delete', function () {
            var timeEntry = $(this).closest('.time-entry');
            Base.confirm('Delete time entry?', function () {
                deleteTimeEntry(timeEntry);
            });
        });
        $(document).on('click', '.task-add-time-entry', function () {
            showTimeEntryForm(0, $(this).closest('.task').data('task-id'));
        });
        $(document).on('click', '.task-toggle-timer', function (event) {
            event.preventDefault();
            var taskID = $(this).closest('.task').data('task-id');
            toggleTimer(taskID);
        });
        $(document).on('click', '.amount-increment', function (event) {
            event.preventDefault();
            incrementTimeAmount($(this).closest('.time-entry-form'));
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
