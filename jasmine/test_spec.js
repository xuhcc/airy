describe('Filters', function () {
    'use strict';

    var $filter;

    beforeEach(module('airyFilters'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('nl2br', function () {
        var result = $filter('nl2br')('aaa\nbbb');
        expect(result).toBe('aaa<br>bbb');
    });
});

