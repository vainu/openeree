'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('person', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.string('first_name');
        table.string('last_name');
        table.date('birthday');
        table.string('personal_identification');
        table.string('half_personal_identification');
        table.boolean('donator');

        table.index(['first_name', 'last_name', 'personal_identification'], 'person_index');
    });
};