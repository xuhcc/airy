function ReportRangeController() {
    const self = this;

    self.formatRange = function () {
        let rangeBeg = moment(self.range.beg);
        let rangeEnd = moment(self.range.end);
        return rangeBeg.format('DD.MM.YY') + ' — ' + rangeEnd.format('DD.MM.YY');
    };

    self.shiftBack = function () {
        let rangeBeg = moment(self.range.beg);
        let rangeEnd = moment(self.range.end);
        self.range = {
            beg: rangeBeg.subtract(1, 'week').format(),
            end: rangeEnd.subtract(1, 'week').format(),
        };
    };

    self.shiftForward = function () {
        let rangeBeg = moment(self.range.beg);
        let rangeEnd = moment(self.range.end);
        self.range = {
            beg: rangeBeg.add(1, 'week').format(),
            end: rangeEnd.add(1, 'week').format(),
        };
    };
}

const reportRangeSelector = {
    template: '\
        <a class="shift-back icon" ng-click="$ctrl.shiftBack()">l</a>\
        <span>{{ $ctrl.formatRange() }}</span>\
        <a class="shift-forward icon" ng-click="$ctrl.shiftForward()">r</a>\
    ',
    bindings: {
        range: '=',
    },
    controller: ReportRangeController,
};

export default reportRangeSelector;
