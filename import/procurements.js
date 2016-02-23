'use strict';

let fs = require('fs');
let csv = require('csv-parse');
let log = require('../lib/log');
let db = require('../lib/db');
let async = require('async');
let moment = require('moment');


// get our data file
fs.readFile(__dirname + '/../data/procurement_data.csv', function (err, data) {
    if (err) {
        log.fatal({err: err}, 'Unable to open file for importing');
        throw new Error(err);
    }

    csv(data.toString(), {delimiter: ';'}, function (err, rows) {
        async.forEachOfSeries(rows, function (row, i, done) {
            if (i === 0) {
                done();
                return;
            }

            let acquirer = row[0];
            let acquirerReq = row[1];
            let description = row[2];
            let referenceCode = row[3];
            let provider = row[4];
            let providerReg = row[5];
            let realPrice = row[6].replace(',', '.');
            let signedOn = row[7].split(' ')[0].split('.');
            let signedOnDate = moment(signedOn, 'DD-MM-YYYY').format('YYYY-MM-DD');
            let status = null;
            switch (row[8]) {
                case 'lõpetatud':
                    status = 'finished';
                    break;
                case 'sõlmitud':
                    status = 'signed';
                    break;
                case 'tühistatud':
                    status = 'cancelled';
                    break;
                case 'koostatud':
                    status = 'composed';
                    break;
                default:
                    status = row[8];
                    break;
            }

            let contractPrice = row[9].replace(',', '.');

            // start the magic
            let acquirerDb = null;
            let reqCompanyId = null;

            db('company')
                .select()
                .where({reg_code: acquirerReq})
                .then(function (acId) {
                    if (acId.length) {
                        return [acId[0].id];
                    } else {
                        return db('company')
                                .insert({
                                    reg_code: acquirerReq,
                                    name: acquirer
                                })
                    }
                })
                .then(function (acDbId) {
                    acquirerDb = acDbId[0];

                    return db('company')
                            .select()
                            .where({reg_code: providerReg});
                })
                .then(function (reqId) {
                    if (reqId.length) {
                        return [reqId[0].id];
                    } else {
                        return db('company')
                                .insert({
                                    reg_code: providerReg,
                                    name: provider
                                });
                    }
                })
                .then(function (reqDbId) {
                    reqCompanyId = reqDbId;

                    return db('procurement')
                            .insert({
                                description: description,
                                reference_number: referenceCode,
                                contract_price: contractPrice,
                                end_price: realPrice,
                                signed_on: signedOnDate,
                                status: status,
                                acquirer: acquirerDb,
                                provider: reqDbId
                            });
                })
                .then(function () {
                    return db('company')
                        .increment('procs_provided', 1).where({id: acquirerDb});
                })
                .then(function () {
                    return db('company')
                        .increment('procs_acquired', 1).where({id: reqCompanyId});
                })
                .then(() => done(), (err) => done(err))
                .catch((err) => done(err));
        }, function (err) {
            if (err) {
                log.error({err: err}, 'Error while importing')
            }

            log.info('Import finished');
        });
    });
});
