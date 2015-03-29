describe('Directives', function () {
    'use strict';
    var scope;
    var element;

    beforeEach(module('airyDirectives'));

    describe('test week selector', function () {
        var element;
        var compile;

        beforeEach(inject(function (_$compile_, $rootScope) {
            compile = _$compile_;
            scope = $rootScope.$new();
            scope.weekBeg = '2015-03-23T00:00:00+03:00';
            element = angular.element('<div week-selector week-beg="weekBeg"></div>');
        }));

        it('should show the date range', function () {
            compile(element)(scope);
            scope.$digest();
            expect(element.find('span').text()).toBe('23.03.15 — 29.03.15');
        });

        it('should shift the date range back and forward', function () {
            compile(element)(scope);
            scope.$digest();
            element.find('.shift-back').click();
            expect(scope.weekBeg).toBe('2015-03-16T00:00:00+03:00');

            element.find('.shift-forward').click();
            expect(scope.weekBeg).toBe('2015-03-23T00:00:00+03:00');
        });
    });
});
