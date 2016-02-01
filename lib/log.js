'use strict';

let bunyan = require('bunyan');
let config = require('easy-config');

let log = bunyan.createLogger({
    name: config.log.name,
    level: config.log.level
});

module.exports = log;