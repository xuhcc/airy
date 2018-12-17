import './calculator.module.js';

describe('Calculator', function () {
    'use strict';

    let scope;
    let buildCtrl;

    beforeEach(module('airy.calculator'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $controller('CalculatorController', {
                $scope: scope,
            });
        };
    }));

    it('should load controller', function () {
        scope.ngDialogData = {duration: 1800};
        buildCtrl();
        expect(scope.duration).toBeDefined();
        expect(scope.price).toBe(0);
        expect(scope.getResult).toBeDefined();
    });

    it('should calculate sum', function () {
        scope.ngDialogData = {duration: 1800};
        buildCtrl();
        scope.price = 10;
        expect(scope.getResult()).toBe('0.50 × 10 = 5.00');
    });
});
