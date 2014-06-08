var Report = (function () {
    'use strict';
    var saveReport = function (projectID) {
        $.ajax({
            type: 'POST',
            url: '/project/' + projectID + '/save_report'
        }).done(function (data) {
            if (data.code === 0) {
                window.location.href = '/project/' + projectID + '/tasks';
            }
        });
    };
    var init = function () {
        $(document).on('click', '.report-save', function (event) {
            event.preventDefault();
            var projectID = $('.current-project').data('project-id');
            Base.confirm('Close tasks and save report?', function () {
                saveReport(projectID);
            });
        });
    };
    return {init: init};
}());

$(function () {
    Base.init();
    Report.init();
});
