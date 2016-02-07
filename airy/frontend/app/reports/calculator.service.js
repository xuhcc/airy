class calculator {

    constructor(ngDialog) {
        this._ngDialog = ngDialog;
    }

    show(duration) {
        const template = '\
            <form class="pure-form calculator-form">\
                <fieldset>\
                    <input type="text" class="price" ng-model="price"><!--\
                    --><input type="text" class="result" readonly value="{{ getResult() }}">\
                </fieldset>\
            </form>';
        this._ngDialog.open({
            template: template,
            plain: true,
            controller: 'CalculatorController',
            data: {duration: duration},
        });
    }
}

export default calculator;
