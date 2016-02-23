'use strict';

let db = require('../lib/db');
db.schema.createTableIfNotExists('company_role', function (table) {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.timestamp('updated_at').defaultTo(db.fn.now());

    table.string('short');
    table.string('long');
}).then(function () {});

module.exports = function () {
    return db.schema.createTableIfNotExists('company_role', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.string('short');
        table.string('long');
    });
};