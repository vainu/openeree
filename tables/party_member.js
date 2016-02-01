'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('party_member', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('party_id').unsigned().references('id').inTable('party');
        table.integer('member_id').unsigned().references('id').inTable('person');
        table.date('joined_at');
        table.date('left_at');
    });
};