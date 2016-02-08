'use strict';

let config = require('easy-config');
let bunyan = require('bunyan');
let logger = require('./lib/log');
let express = require('express');
let bodyParser = require('body-parser');
let db = require('./lib/db');

let app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
// this is JSON API, we'll need to use express json bodyParser
app.use(bodyParser.json());

// Attach logger to req
app.use(function (req, res, next) {
    req.log = logger.child({reqId: req.id});
    next();
});
app.use(express.static('public'));
// Attach trace level request logging
// Please note that this logging is performance heavy and it is not advisable to have this on in production
app.use(function (req, res, next) {
    req.log.trace({req: req}, 'Incoming request');
    next();
});

// As this is read-only API, let's send 405 for other CRUD requests
// We intentionally block only these 3. We do not want to explicitly allow GET as this might have unexpected results
// ex. consider OPTIONS request.
function notAllowed(req, res) {
    res.sendStatus(405);
}

app.post('*', notAllowed);
app.delete('*', notAllowed);
app.patch('*', notAllowed);

app.get('/',function(req, res, next){
    res.sendFile(__dirname + '/index.html');
});

// attach our routes
app.use('/api', allowCrossDomain, require('./routes')());

// bind to port defined in config
app.listen(config.port, function () {
    logger.info('Started on port', config.port);
});
