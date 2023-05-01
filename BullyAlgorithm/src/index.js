const express = require('express');
const axios = require('axios');
const Logger = require('./logger');
const ConsulConfig = require('./consul');
// const random = require('random-int');
const crypto = require("crypto");

let coordinatorNode = null;
let isAwaitingNewCoordinator = false;

(async () => {
    const app = express();
    const nodes = getNodes(process.argv);
    const thisNode = nodes[0];

    // const httpProxy = require('http-proxy');
    // const apiProxy = httpProxy.createProxyServer();

    const logger = new Logger(process.pid, thisNode);

    registerNodeEndpoints(app, nodes, logger);
    setInterval(() => pingCoordinator(nodes, logger), 5000);

    
    app.listen(thisNode.host.port, () => logger.log('Node up and listening'));
    startElection(nodes, logger);
})();

//Get the Node, Node ID
function getNodes(args) {
    let nodes = args.slice(2).map(x => {

        let tokens = x.split(':');
        return {
            key: parseInt(tokens[0]),
            host: new URL(tokens.slice(1).join(':'))
        };
    });

    return nodes;
}

//APIs to check,start and select the leader.
function registerNodeEndpoints(app, nodes, logger) {
    // const id = 0;


    const nodeID = new Date().getUTCMilliseconds() + crypto.randomInt(10);
    const consul = new ConsulConfig("Paxos "+nodeID+"");

    //Checking the status of candidates
    app.get('/alive', (req, res) => res.sendStatus(200));

    //Start election
    app.get('/election', (req, res) => {
        res.sendStatus(200);
        startElection(nodes, logger);
    });

    //Selecting the winner
    app.get('/winner', (req, res) => {
        isAwaitingNewCoordinator = false;
        coordinatorNode = nodes.filter(x => x.key == req.query.key)[0];
        res.sendStatus(200);
        logger.log(`Set ${coordinatorNode.host.href} as the new coordinator`);
    });
}

//Ping and check the coordinator status
async function pingCoordinator(nodes, logger) {
    try {
        let url = new URL('/alive', coordinatorNode.host);
        await axios.get(url.href);//if available continue
        logger.log(`Coordinator ${coordinatorNode.host.href} is up`);
    } catch (error) {
        logger.log(`Coordinator ${coordinatorNode.host.href} is down!`);//if not re-elect
        startElection(nodes, logger);
    }
}


//Starting to elect a leader using the random key generated
async function startElection(nodes, logger) {
    logger.log('Starting election...');

    isAwaitingNewCoordinator = true;
    let thisNode = nodes[0];
    let candidates = nodes.slice().sort((a, b) => b.key - a.key); //Candidate selected by descending order, by key

    for (candidate of candidates) {
        if (candidate.key === thisNode.key) {
            logger.log('Declaring self as the new coordinator');

            await Promise.all(
                nodes.map(x => {
                    let url = new URL('/winner', x.host);
                    return axios.get(url.href, { params: { key: thisNode.key } });
                })
            ).catch(() => { });

            break;
            //If there is no winner re-elect
            // 1) Check the hosts
        } else {

            try {
                // send election message to candidate
                let url = new URL('/election', candidate.host);
                await axios.get(url.href);

                // if a response is received, wait for subsequent victory message, if not restart the election
                setTimeout(() => {
                    if (isAwaitingNewCoordinator) {
                        startElection();
                    }
                }, 10000);

                break;
            } catch (error) {
            //     if (error.response) {
            //         //response status is an error code
            //         console.log(error.response.status);
            //     }
            //     else if (error.request) {
            //         //response not received though the request was sent
            //         console.log(error.request);
            //     }
            //     else {
            //         //an error occurred when setting up the request
            //         console.log(error.message);
            //     }
            }

        }
    }
}
