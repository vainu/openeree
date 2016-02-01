'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');

module.exports = function () {
    let app = express.Router();

    app.get('/', function (req, res) {
        let q = db.select().from('person');

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id', function (req, res) {
        let q = db.select().from('person').where({id: req.params.id});

        dbUtils.sendResponse(q, req, res, true);
    });

    return app;
};