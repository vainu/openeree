'use strict';

/**
 * Company roles import
 **/

let roles = require('../data/company_roles.json');
let async = require('async');

let db = require('../lib/db');
let log = require('../lib/log');

async.forEachOf(roles, function (value, key, done) {
    db('company_role').insert({
        short: key,
        long: value
    }).then(function () {
        done();
    }, function (err) {
        done(err);
    }).catch(function (err) {
        done(err);
    })
}, function (err) {
    if (err) {
        log.error({err: err}, 'Unable to import roles');
        return;
    }

    log.info('Import finished');
});