// import requests
// import random


function get_acceptors_from_service_registry() {
    acceptor_array = {}
    response = requests.get('http://127.0.0.1:8500/dc1/services')
    nodes = response.json()

    nodes.forEach(element => {
        if (length(nodes[each]['Meta']) > 0) {
            if (nodes[each]['Meta']['Role'] == 'Acceptor') {
                node = nodes[each]['Service'];
                role = nodes[each]['Port'];
                key = node;
                value = role;
                acceptor_array[key] = value;
            }
        }
    });

    print('acceptor_array', acceptor_array);

    random_acceptor = random.choice(list(acceptor_array.items()));
    url = 'http://localhost:$random_acceptor[1]/primeResult';
    return url
}