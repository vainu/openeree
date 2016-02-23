'use strict';
/**
 * Company employee import
 */

let fs = require('fs');
let csv = require('csv-parse');
let log = require('../lib/log');
let db = require('../lib/db');
let async = require('async');
let moment = require('moment');

// get our data file
async.forEach(['company_employees.csv'], function (file, fileDone) {
    fs.readFile(__dirname + '/../data/'+ file, function (err, data) {
        if (err) {
            log.fatal({err: err}, 'Unable to open file for importing');
            throw new Error(err);
        }

        csv(data.toString(), {delimiter: ','}, function (err, rows) {

            // put stuff to DB
            // remove first row (csv header with column names)
            rows.shift();

            // expected column order:
            // 0 - 'id (not used)',
            // 1 - 'company reg_code',
            // 2 - 'isikukood',
            // 3 - 'role',
            // 4 - 'country',
            // 5 - 'first_name',
            // 6 - 'last_name'

            async.eachSeries(rows, function (row, done) {
                let companyRegCode = row[1];
                let personCode = row[2];
                let halfCode = row[2].substr(1, 6);
                let role = row[3];
                let country = row[4];
                let firstName = row[5].toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                let lastName = row[6].toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                let personId = null;
                let roles = null;
                // #1 - find person, using identification code
                // #2 - find company, using reg code
                // #3 - insert into employee table

                db('company_role').select().then(function (companyRoles) {
                        roles = companyRoles.reduce(function (obj, value, index) {
                            obj[value.short.toUpperCase()] = value.id;
                            return obj;
                        },{});

                        return db('person')
                            .select('id')
                            .where(function () {
                                this
                                    .where('personal_identification', personCode)
                                    .orWhere('half_personal_identification', halfCode);
                            })
                    }).then(function (person) {
                        if (person && person.length) {
                            return [person[0].id];
                        }

                        return db('person').insert({
                            first_name: firstName,
                            last_name: lastName,
                            personal_identification: personCode
                        });
                    }).then(function (person) {
                        personId = person[0];

                        return db('company').select('id').where('reg_code', companyRegCode);
                    }).then(function (companyId) {
                        if (!companyId || !companyId.length) {
                            throw new Error(err);
                        }

                        let cId = companyId[0].id;

                        let data = {
                            company_id: cId,
                            employee_id: personId,
                            role_id: roles[role.toUpperCase()]
                        };

                        return db('company_employee').insert(data);
                    }).then(function () {
                        done();
                    }, function (err) {
                        done(err);
                    }).catch(function (err) {
                        done(err);
                    });

            }, function (err) {
                fileDone(err);
            });
        });
    });

}, function (err) {
    if (err) {
        log.error({err: err}, 'Error while inserting row');
        return;
    }

    log.info('Import successfully finished');
});
