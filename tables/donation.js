'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('donation', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('party_id').unsigned().references('id').inTable('party');
        table.integer('member_id').unsigned().references('id').inTable('person');
        table.decimal('amount', 13, 2);
        table.integer('year');
    });
};