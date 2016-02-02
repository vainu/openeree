'use strict';

let config = require('easy-config');
let logger = require('./log');
let knex = require('knex')({
    client: config.db.client,
    connection: {
	host		:config.db.host,
        socketPath     : config.db.socketPath,
        user     : config.db.user,
        password : config.db.password,
        database : config.db.database
    }
});

// a friendly remainder about limiting this DB users access
// we only do it for mysql as other client types might not be able to run this query without errors
if (config.db.client === 'mysql') {
    knex.raw('SELECT * FROM information_schema.schema_privileges WHERE privilege_type IN ("insert", "updated", "delete")').then(function (privs) {
        if (privs.length > 0) {
            logger.warn('Unnecessary privileges found for current DB user. Please consider limiting access for this user as this is read-only API');
        }
    }, function (err) {
        logger.error({err: err}, 'Error while asking user permissions from DB');
    }).catch(function (err) {
        logger.fatal({err: err}, 'Fatal error while asking user permissions from DB');
    });
}

module.exports = knex;
