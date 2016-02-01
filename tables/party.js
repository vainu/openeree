'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('party', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.string('name');
        table.string('reg_code');
    });
};
