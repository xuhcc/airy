const calculatorTemplate = `
    <form class="pure-form calculator-form">
        <fieldset>
            <input type="text" class="price" ng-model="price"><!--
            --><input type="text" class="result" readonly value="{{ getResult() }}">
        </fieldset>
    </form>`;

export class calculator {

    constructor(ngDialog) {
        this._ngDialog = ngDialog;
    }

    show(duration) {
        this._ngDialog.open({
            template: calculatorTemplate,
            plain: true,
            controller: 'CalculatorController',
            data: {duration: duration},
        });
    }
}
