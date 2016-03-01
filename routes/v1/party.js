'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');


module.exports = function () {
    let app = express.Router();

    let companiesQ = db
        .select()
        .join('company', 'company_employee.company_id', 'company.id')
        .from('company_employee');

    let partyQ = db
        .select()
        .join('party', 'party_member.party_id', 'party.id')
        .from('party_member');

    app.get('/', function (req, res) {
        let q = db
            .select()
            .from('party');

        let metaQ = db.select('field', 'value').from('party_metadata');

        dbUtils.sendResponse(q, req, res, null, [{
                q: metaQ,
                field: 'metadata',
                where: 'party_id',
                reduce: function (obj, value) {
                    obj[value.field] = value.value;
                    return obj;
                }
            }]
        );
    });

    app.get('/:id', function (req, res) {
        let q = db
            .select()
            .from('party')
            .where({ id: req.params.id });

        let metaQ = db.select('field', 'value').from('party_metadata');

        dbUtils.sendResponse(q, req, res, true, [{
            q: metaQ,
            field: 'metadata',
            where: 'party_id',
            reduce: function (obj, value) {
                obj[value.field] = value.value;
                return obj;
            }
        }]);
    });

    app.get('/:id/members', function (req, res) {
        let q = db
            .select()
            .join('person', 'party_member.member_id', 'person.id')
            .from('party_member')
            .where({party_id: req.params.id});

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id/donations', function (req, res) {
        let q = db
            .select()
            .join('person', 'donation.member_id', 'person.id')
            .from('donation')
            .where({party_id: req.params.id});

        dbUtils.sendResponse(q, req, res, false, [{
            q: companiesQ,
            field: 'companies',
            where: 'employee_id'
        }]);
    });

    app.get('/:id/donations/sum', function (req, res) {
        let q = db
            .select('*')
            .sum('amount as total_amount')
            .join('person', 'donation.member_id', 'person.id')
            .from('donation')
            .groupBy('member_id')
            .where({party_id: req.params.id});

        dbUtils.sendResponse(q, req, res, false, [{
            q: companiesQ,
            field: 'companies',
            where: 'employee_id'
        }, {
            q: partyQ,
            field: 'party',
            where: 'member_id',
            whereId: 'party_id'
        }]);
    });

    return app;
};