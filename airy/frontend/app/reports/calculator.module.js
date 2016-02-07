import CalculatorController from 'reports/calculator.controller.js';
import calculator from 'reports/calculator.service.js';

export default angular.module('airy.calculator', [])
    .controller('CalculatorController', CalculatorController)
    .service('calculator', calculator);
