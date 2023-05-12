import randomInteger from 'random-int';
import file_name from './resources/PrimeNumbers.txt';
import file_name from './checkPrime';

function scheduleWorkForOroposers(combined){
    count = 0;
    range_array_proposers = [];
    combined.forEach(()=>{
        if (combined[each][0] == 'Proposer'){
            range_array_proposers.push(combined[each][1]);
            count = count + 1;
        }
    });
    print('range_array', range_array_proposers);

    random_num = readNumberFromFile();
    proposer_list_len = len(range_array_proposers);
    num_range = math.floor(random_num / proposer_list_len);
    start = 2;

    range.forEach((proposer_list_len)=>{
        divide_range = {
            "start": start,
            "end": start + num_range,
            "random_num": random_num
        }
        print(divide_range);
        url = 'http://localhost:$range_array_proposers[each]/proposer-schedule';
        print(url);
        requests.post(url, json=divide_range);

        start += num_range + 1
    });
}

//Read a random number from file
function readNumberFromFile(){
    var f = require('f');
    const file_name = "../resources/PrimeNumbers.txt";
    console.log("File",file_name);
    f.readFile(file_name, function(err, data) {
        if(err) throw err;
        lines = data.split("\n");
        random_num = int(randomInteger.choice(lines));
    });
    return random_num
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



