function generate_node_id(){
    millis = int(round(time.time() * 1000));
    // const nodeID = new Date().getUTCMilliseconds() + crypto.randomInt(10);
    node_id = millis + randint(800000000000, 900000000000);
    return node_id;
}
console.log(node_id);
main