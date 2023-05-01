// const lib = require("./coordinatorWork");

var isPrimeNumber = function (number) {
    if (number == 1 || number == 2) {
        return true;
    }
    for (var i = 2; i < number; i++) {
        if (number % i == 0) {
            return false;
        }
    }
    return true;
}
console.log(isPrimeNumber(5));
