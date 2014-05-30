var Report = (function () {
    'use strict';
    var closeTasks = function (projectID) {
        $.ajax({
            type: 'POST',
            url: '/project/' + projectID + '/close_completed_tasks'
        }).done(function (data) {
            if (data.code === 0) {
                window.location.href = '/project/' + projectID + '/tasks';
            }
        });
    };
    var init = function () {
        $(document).on('click', '.report-close-tasks', function (event) {
            event.preventDefault();
            var projectID = $('.current-project').data('project-id');
            Base.confirm('Close tasks?', function () {
                closeTasks(projectID);
            });
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Report.init();
});
