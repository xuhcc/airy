(function () {
    'use strict';

    angular
        .module('airy.calculator')
        .factory('calculator', calculator);

    function calculator(ngDialog) {
        return {
            show: function (duration) {
                var template = '\
                    <form class="pure-form calculator-form">\
                        <fieldset>\
                            <input type="text" class="price" ng-model="price"><!--\
                            --><input type="text" class="result" readonly value="{{ getResult() }}">\
                        </fieldset>\
                    </form>';
                ngDialog.open({
                    template: template,
                    plain: true,
                    controller: function ($scope) {
                        $scope.duration = moment.duration($scope.ngDialogData.duration, 'seconds');
                        $scope.price = 0;
                        $scope.getResult = function () {
                            var hours = $scope.duration.asHours().toFixed(2);
                            var result = hours * parseFloat($scope.price);
                            return hours + ' × ' + $scope.price + ' = ' + result.toFixed(2);
                        };
                    },
                    data: {duration: duration},
                });
            },
        };
    }
})();
