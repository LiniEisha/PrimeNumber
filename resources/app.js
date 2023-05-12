import { readFileSync, writeFileSync } from 'fs';
var sample = readFileSync('PrimeNumbers.txt', 'utf8');
writeFileSync('output.txt', sample);


var lines = sample.split("\n");
var randLineNum = Math.floor(Math.random() * lines.length);


console.log('Random line: ', sample[randLineNum]);
console.log('Random number: ', 33377);

var isPrimeNumber = function (number) {
  if (number == 1 || number == 2) {
    return true;
  }
  for (var i = 2; i < number; i++) {
    if (number % i == 0) {
      console.log("It is a not Prime number");

      return false;
    }

  }
  console.log("It is a Prime number");

  return true;

}

console.log(isPrimeNumber(33377));
