describe('Filters', function () {
    var $filter;

    beforeEach(module('airyFilters'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('nl2br', function () {
        var result = $filter('nl2br')('aaa\nbbb');
        expect(result).toBe('aaa<br>bbb');
    });

    it('getById', function () {
        var input = [
            {id: 1, name: 'a'},
            {id: 2, name: 'b'},
            {id: 3, name: 'c'}
        ];
        var result = $filter('getById')(input, 3);
        expect(result.name).toBe('c');
    });
});

