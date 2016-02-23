'use strict';

let db = require('../lib/db');

module.exports = function () {
    return db.schema.createTableIfNotExists('company_employee', function (table) {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());

        table.integer('company_id').unsigned().references('id').inTable('company');
        table.integer('employee_id').unsigned().references('id').inTable('person');
        table.integer('role_id').unsigned().references('id').inTable('company_role');
    });
};