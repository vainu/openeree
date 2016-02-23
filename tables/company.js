'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('company', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('procs_provided').defaultTo(0);
        table.integer('procs_acquired').defaultTo(0);

        table.string('name');
        table.string('reg_code');
    });
};
