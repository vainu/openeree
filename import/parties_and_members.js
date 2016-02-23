'use strict';
/**
 * Parties and members import script.
 * This script is expecting csv to have fixed format
 * bear that in mind when changing the import data files
 */

let fs = require('fs');
let csv = require('csv-parse');
let log = require('../lib/log');
let db = require('../lib/db');
let async = require('async');
let moment = require('moment');

// get our data file
fs.readFile(__dirname + '/../data/parties_and_party_members_14.01.csv', function (err, data) {
    if (err) {
        log.fatal({err: err}, 'Unable to open file for importing');
        throw new Error(err);
    }

    csv(data.toString(), {delimiter: ';'}, function (err, rows) {

        // put stuff to DB
        // remove first row (csv header with column names)
        rows.shift();

        // expected column order:
        // 0 - 'registrikood',
        // 1 - 'nimi',
        // 2 - 'isikukood',
        // 3 - 'liige',
        // 4 - 'astumise_kpv',
        // 5 - 'lahk_seisu_kpv',
        // 6 - 'lteate_kpv'
        async.eachSeries(rows, function (row, done) {
            let regCode = row[0].replace(/\s/g, '');
            let partyName = row[1];
            let identificationCode = row[2];
            let personName = row[3].split(' ');
            let firstName = personName.shift().toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            let lastName = personName.join(' ').toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '); // middle names go to last name column
            let joinedAt = null;
            let quitDate = row[5];

            if (row[4].length > 0) {
                joinedAt = moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD');
            }

            let memberId = null;
            // start with persons
            db('person').insert({
                first_name: firstName,
                last_name: lastName,
                personal_identification: identificationCode
            }).then(function (mId) {
                memberId = mId[0];

                return db('party').where({
                    name: partyName,
                    reg_code: regCode
                }).select('id')
            }).then(function (partyId) {
                if (partyId.length) {
                    return [partyId[0].id];
                } else {
                    return db('party').insert({
                        name: partyName,
                        reg_code: regCode
                    });
                }
            }).then(function (partyId) {
                return db('party_member').insert({
                    party_id: partyId[0],
                    member_id: memberId,
                    joined_at: joinedAt
                });
            }).then(function () {
                log.info({data: arguments}, 'Successfully inserted rows');
                done();
            }, function (err) {
                done(err);
            }).catch(function (err) {
                done(err);
                throw new Error(err);
            });
        }, function (err) {
            if (err) {
                log.error({err: err}, 'Error while inserting row');
            }

            log.info('Import finished');
        });
    });
});