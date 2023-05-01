//Generally the module name and the variable name both are same
import { readFileSync, writeFileSync } from 'fs';
// fs.readFileSync
// Sync' part allows the node to read the file synchronusly meaning all file is read first before going through other code. 
var sample = readFileSync('PrimeNumbers.txt', 'utf8');
// utf8 is encoding format| you can find clean explanation here at http://stackoverflow.com/a/15128103/5388823 
// console.log(sample);

// this line of code creates an another file output.txt and writes the data in sample into the log.
writeFileSync('output.txt', sample);


var lines = sample.split("\n");
var randLineNum = Math.floor(Math.random() * lines.length);


console.log('Random line: ', sample[randLineNum]); // random line from the text file
console.log('Random number: ', 33377); // random line from the text file

// const lib = require("./coordinatorWork");

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
