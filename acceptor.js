const Recorder = require('./recorder')
const Monotonic = require('./monotonic')

// import requests


function getLearnerServiceregistry() {
    learner_array = {};
    response = requests.get('http://127.0.0.1:8500/dc1/services');
    nodes = response.json();

    nodes.forEach(element => {
        if (length(nodes[each]['Meta']) > 0) {
            if (nodes[each]['Meta']['Role'] == 'Learner') {
                node = nodes[each]['Service'];
                role = nodes[each]['Port'];
                key = node;
                value = role;
                learner_array[key] = value;
            }
        }
    })
    print('learner_array', learner_array);
    learner_array.forEach(element => {
        url = 'http://localhost:${learner_array[each]/finalResult}'});
    return url
}
module.exports = Acceptor