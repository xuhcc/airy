var airyFilters = angular.module('airyFilters', []);

airyFilters.filter('nl2br', function () {
    return function (data) {
        if (!data) {
            return data;
        }
        return data.replace(/\n\r?/g, '<br>');
    };
});

airyFilters.filter('getById', function () {
    return function (input, id) {
        for (i = 0; i < input.length; i++) {
            if (input[i].id == id) {
                return input[i];
            }
        }
        return null;
    };
});
