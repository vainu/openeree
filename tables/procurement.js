'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('procurement', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('acquirer').unsigned().references('id').inTable('company');
        table.integer('provider').unsigned().references('id').inTable('company');

        table.text('description');
        table.string('reference_number');
        table.decimal('contract_price', 13, 2);
        table.decimal('end_price', 13, 2);
        table.date('signed_on');
        table.string('status');
    });
};
