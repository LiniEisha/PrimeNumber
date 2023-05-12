const express = require('express');
const axios = require('axios');
const Logger = require('./logger');
const ConsulConfig = require('./consul');
const crypto = require("crypto");

let coordinatorNode = null;
let isAwaitingNewCoordinator = false;

(async () => {
    try{
    const app = express();
    const nodes = getNodes(process.argv);
    const thisNode = nodes[0];
    const logger = new Logger(process.pid, thisNode);

    registerNodeEndpoints(app, nodes, logger);
    setInterval(() => pingCoordinator(nodes, logger), 5000);

    
    app.listen(thisNode.host.port, () => logger.log('Node up and listening'));
    startElection(nodes, logger);
    }catch(error){
        alert(error);
    }
})();

//Get the Node
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

//start and select the leader.
function registerNodeEndpoints(app, nodes, logger) {

    const nodeId = new Date().getUTCMilliseconds() + crypto.randomInt(10);
    const consul = new ConsulConfig("Paxos "+nodeId+"");

    app.get('/alive', (req, res) => res.sendStatus(200));

    //Starting the  election
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
        await axios.get(url.href);
        logger.log(`Coordinator ${coordinatorNode.host.href} is up`);
    } catch (error) {
        logger.log(`Coordinator ${coordinatorNode.host.href} is down!`);//if not re-elect
        startElection(nodes, logger);
    }
}


//Starting to elect a leader using the random key generated
async function startElection(nodes, logger) {
    try {
      logger.log('Starting election...');
  
      isAwaitingNewCoordinator = true;
      let thisNode = nodes[0];
      let candidates = nodes.slice().sort((a, b) => b.key - a.key);
  
      for (candidate of candidates) {
        if (candidate.key === thisNode.key) {
          logger.log('Declaring self as the new coordinator');
  
          await Promise.all(
            nodes.map(x => {
              let url = new URL('/winner', x.host);
              return axios.get(url.href, { params: { key: thisNode.key } });
            })
          ).catch(() => {});
  
          break;
        } else {
          try {
            let url = new URL('/election', candidate.host);
            await axios.get(url.href);
  
            setTimeout(() => {
              if (isAwaitingNewCoordinator) {
                startElection(nodes, logger);
              }
            }, 10000);
  
            break;
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log(error.message);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  