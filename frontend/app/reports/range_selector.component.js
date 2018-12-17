class ReportRangeController {

    formatRange() {
        let rangeBeg = moment(this.range.beg);
        let rangeEnd = moment(this.range.end);
        return rangeBeg.format('DD.MM.YY') + ' — ' + rangeEnd.format('DD.MM.YY');
    }

    shiftBack() {
        this.period.shiftBack(this.range);
    }

    shiftForward() {
        this.period.shiftForward(this.range);
    }
}

export const reportRangeSelector = {
    template: `
        <a class="shift-back icon" ng-click="$ctrl.shiftBack()">l</a>
        <span>{{ $ctrl.formatRange() }}</span>
        <a class="shift-forward icon" ng-click="$ctrl.shiftForward()">r</a>
    `,
    bindings: {
        range: '=',
        period: '<',
    },
    controller: ReportRangeController,
};
