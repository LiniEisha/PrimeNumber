import randomInteger from 'random-int';
import file_name from './resources/PrimeNumbers.txt';

// Schedule the range that they should start dividing based on the number.
function schedule_work_for_proposers(combined){
    count = 0;
    range_array_proposers = [];
    combined.forEach(()=>{
        if (combined[each][0] == 'Proposer'){
            range_array_proposers.push(combined[each][1]);
            count = count + 1;
        }
    });
    print('range_array', range_array_proposers);

    random_number = read_number_from_file();
    proposer_list_len = len(range_array_proposers);
    number_range = math.floor(random_number / proposer_list_len);
    start = 2;

    range.forEach((proposer_list_len)=>{
        divide_range = {
            "start": start,
            "end": start + number_range,
            "random_number": random_number
        }
        print(divide_range);
        url = 'http://localhost:$range_array_proposers[each]/proposer-schedule';
        print(url);
        requests.post(url, json=divide_range);

        start += number_range + 1
    });
}

//Read a random number from file
function read_number_from_file(){
    var f = require('f');
    const file_name = "../resources/PrimeNumbers.txt";
    console.log("File",file_name);
    f.readFile(file_name, function(err, data) {
        if(err) throw err;
        lines = data.split("\n");
        random_number = int(randomInteger.choice(lines));
    });
    return random_number
}

//Check prime number
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
// console.log(isPrimeNumber(10));
// console.log(isPrimeNumber(random_number));



