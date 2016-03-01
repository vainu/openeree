'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');

module.exports = function () {
    let app = express.Router();

    let employeesQ = db
        .select()
        .join('person', 'company_employee.employee_id', 'person.id')
        .join('company_role', 'company_employee.role_id', 'company_role.id')
        .leftJoin('party_member', 'person.id', 'party_member.member_id')
        .leftJoin('party', 'party_member.party_id', 'party.id')
        .from('company_employee');

    app.get('/', function (req, res) {
        let q = db.select().from('company');

        dbUtils.sendResponse(q, req, res, false, [
            {
                q: employeesQ,
                field: 'employees',
                where: 'company_id'
            }
        ]);
    });

    app.get('/:id', function (req, res) {
        let q = db.select().from('company').where({id: req.params.id});

        dbUtils.sendResponse(q, req, res, true);
    });

    app.get('/:id/employees', function (req, res) {
        let q = db
            .select()
            .join('person', 'company_employee.employee_id', 'person.id')
            .join('company_role', 'company_employee.role_id', 'company_role.id')
            .from('company_employee')
            .where({company_id: req.params.id});

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id/full', function (req, res) {
        let q = db
            .select()
            .from('company')
            .where({id: req.params.id});


        let procQ = db
            .select()
            .from('procurement');


        dbUtils.sendResponse(q, req, res, true, [{
            q: employeesQ,
            field: 'employees',
            where: 'company_id'
        }, {
            q: procQ,
            field: 'procsBy',
            where: 'acquirer'
        }, {
            q: procQ,
            field: 'procsTo',
            where: 'provider'
        }])

    });

    return app;
};