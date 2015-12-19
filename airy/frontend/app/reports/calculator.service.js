(function () {
    'use strict';

    angular
        .module('airy.calculator')
        .factory('calculator', calculator);

    function calculator(ngDialog) {
        var service = {
            show: showCalculator,
        };
        return service;

        function showCalculator(duration) {
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
                controller: 'CalculatorController',
                data: {duration: duration},
            });
        }
    }
})();
