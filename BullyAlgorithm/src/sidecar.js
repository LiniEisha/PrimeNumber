const express = require('express');
const app = express();

const httpProx = require('http-proxy');
const apiProx = httpProx.createProxyServer();

const NODE = process.env.NODE;
const Logger = require('./lib/really-cool-logger');
const logger = new Logger(NODE);

const {
  TARGET = 'http://localhost:3000',
  PORT = 80
} = process.env;

app.all('/*', (req, res) => {
  logger.send(TARGET, req.url, Date.now());
  apiProx.web(req, res, { target: TARGET });
});

app.listen(PORT);