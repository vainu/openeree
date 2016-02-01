'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');

module.exports = function () {
    let app = express.Router();

    app.get('/', function (req, res) {
        let q = db
            .select('*',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .from('procurement')
            .join('company as provider', 'procurement.provider', 'provider.id')
            .join('company as acquirer', 'procurement.acquirer', 'acquirer.id');

        dbUtils.sendResponse(q, req, res);
    });

    app.get('/:id', function (req, res) {
        let q = db
            .select('*',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .from('procurement')
            .join('company as provider', 'procurement.provider', 'provider.id')
            .join('company as acquirer', 'procurement.acquirer', 'acquirer.id')
            .where({'procurement.id': req.params.id});

        dbUtils.sendResponse(q, req, res, true);
    });

    return app;
};