'use strict';

let express = require('express');
let db = require('../../lib/db');
let dbUtils = require('../../lib/dbUtils');

module.exports = function () {
    let app = express.Router();

    // some more commonly used Q's in these routes
    let employeesQ = db
        .select('*', 'person.id AS person_id')
        .join('person', 'company_employee.employee_id', 'person.id')
        .join('company_role', 'company_employee.role_id', 'company_role.id')
        .leftJoin('party_member', 'person.id', 'party_member.member_id')
        .leftJoin('party', 'party_member.party_id', 'party.id')
        .from('company_employee');

    let procQ = db
        .join('company as acquirer', 'procurement.acquirer', 'acquirer.id')
        .join('company as provider', 'procurement.provider', 'provider.id')
        .from('procurement');

    let employeeSubQ = {
        q: employeesQ,
        field: 'employees',
        where: 'company_employee.company_id',
        whereId: 'company_id'
    };

    app.get('/mostprocsby', function (req, res) {
        let q = procQ.clone()
            .select(
                'acquirer.id AS company_id',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .sum('end_price AS total_amount')
            .groupBy('acquirer.reg_code');

        dbUtils.sendResponse(q, req, res, false, [employeeSubQ]);
    });

    app.get('/mostprocsby/withprocs', function (req, res) {
        let q = procQ.clone()
            .select(
                'acquirer.id AS company_id',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .sum('end_price AS total_amount')
            .groupBy('acquirer.reg_code');

        let procsQ = procQ.clone()
            .select('*',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .orderBy('signed_on');

        dbUtils.sendResponse(q, req, res, false, [{
            q: procsQ,
            field: 'procurements',
            where: 'acquirer.reg_code',
            whereId: 'acquirer_reg_code'
        }, employeeSubQ]);
    });

    app.get('/mostprocsto', function (req, res) {
        let q = procQ.clone()
            .select(
                'provider.id AS company_id',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code'
            )
            .sum('end_price AS total_amount')
            .groupBy('provider.reg_code');


        dbUtils.sendResponse(q, req, res, false, [employeeSubQ]);
    });

    app.get('/mostprocsto/withprocs', function (req, res) {
        let q = procQ.clone()
            .select(
                'provider.id AS company_id',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code'
            )
            .sum('end_price AS total_amount')
            .groupBy('provider.reg_code');

        let procsQ = procQ.clone()
            .select('*',
                'provider.name AS provider_name',
                'provider.reg_code AS provider_reg_code',
                'acquirer.name AS acquirer_name',
                'acquirer.reg_code AS acquirer_reg_code'
            )
            .orderBy('signed_on');

        dbUtils.sendResponse(q, req, res, false, [{
            q: procsQ,
            field: 'procurements',
            where: 'provider.reg_code',
            whereId: 'provider_reg_code'
        }, employeeSubQ]);
    });

    return app;
};