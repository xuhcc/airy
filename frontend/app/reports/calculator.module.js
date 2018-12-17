import { CalculatorController } from './calculator.controller.js';
import { calculator } from './calculator.service.js';

export default angular.module('airy.calculator', [])
    .controller('CalculatorController', CalculatorController)
    .service('calculator', calculator);
