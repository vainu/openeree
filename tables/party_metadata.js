'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('party_metadata', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('party_id').unsigned().references('id').inTable('party');
        table.string('field');
        table.string('value');
    });
};