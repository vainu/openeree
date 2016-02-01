'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');


module.exports = function () {
    let app = express.Router();

    app.get('/', function (req, res) {
        let q = db.select().from('party');

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id', function (req, res) {
        let q = db.select().from('party').where({ id: req.params.id });

        dbUtils.sendResponse(q, req, res, true);
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

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id/donations/sum', function (req, res) {
        let q = db
            .select('*')
            .sum('amount as total_amount')
            .join('person', 'donation.member_id', 'person.id')
            .from('donation')
            .groupBy('member_id')
            .where({party_id: req.params.id});

        dbUtils.sendResponse(q, req, res);
    });

    return app;
};