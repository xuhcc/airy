(function () {
    'use strict';

    angular
        .module('airy.resources')
        .factory('timeEntryResource', timeEntryResource);

    function timeEntryResource($http) {
        var service = {
            create: createTimeEntry,
            update: updateTimeEntry,
            delete: deleteTimeEntry,
        };
        return service;

        function prepare(timeEntry) {
            return {
                duration: timeEntry.duration,
                comment: timeEntry.comment,
                task_id: timeEntry.task_id,
            };
        }

        function createTimeEntry(timeEntry) {
            return $http.post('/time_entries', prepare(timeEntry));
        }

        function updateTimeEntry(timeEntry) {
            return $http.put('/time_entries/' + timeEntry.id, prepare(timeEntry));
        }

        function deleteTimeEntry(timeEntry) {
            return $http.delete('/time_entries/' + timeEntry.id);
        }
    }
})();
