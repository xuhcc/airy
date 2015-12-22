function CalculatorController($scope) {
    $scope.duration = moment.duration($scope.ngDialogData.duration, 'seconds');
    $scope.price = 0;
    $scope.getResult = getResult;

    function getResult() {
        var hours = $scope.duration.asHours().toFixed(2);
        var result = hours * parseFloat($scope.price);
        return hours + ' × ' + $scope.price + ' = ' + result.toFixed(2);
    }
}

export default CalculatorController;
