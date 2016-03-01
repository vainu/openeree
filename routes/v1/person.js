'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');

module.exports = function () {
    let app = express.Router();

    app.get('/', function (req, res) {
        let q = db.select('*', db.raw("CONCAT(first_name, ' ', last_name) AS full_name")).from('person');

        if (req.query.full_name) {
            q.whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ['%'+ req.query.full_name +'%']);
            console.log('Adding where', q.toString());
        }

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id', function (req, res) {
        let q = db.select().from('person').where({id: req.params.id});

        dbUtils.sendResponse(q, req, res, true);
    });

    app.get('/:id/full', function (req, res) {
        let q = db
            .select('*', 'person.id AS person_id')
            .leftJoin('party_member', 'person.id', 'party_member.member_id')
            .leftJoin('party', 'party_member.party_id', 'party.id')
            .from('person')
            .where({'person.id': req.params.id});

        let companiesQ = db
            .select()
            .join('company', 'company_employee.company_id', 'company.id')
            .from('company_employee');

        let donationsQ = db
            .select('*', 'name AS party_name')
            .join('party', 'donation.party_id', 'party.id')
            .from('donation');

        dbUtils.sendResponse(q, req, res, true, [{
            q: companiesQ,
            field: 'companies',
            where: 'company_employee.employee_id',
            whereId: 'person_id'
        }, {
            q: donationsQ,
            field: 'donations',
            where: 'member_id',
            whereId: 'person_id'
        }]);
    });

    return app;
};