'use strict';

let fs = require('fs');
let csv = require('csv-parse');
let log = require('../lib/log');
let db = require('../lib/db');
let async = require('async');

// this is import script, sync reading is fine here
let donationYears = [2013, 2014, 2015];

async.waterfall([
    function (cb) {
        db
            .select('id', 'name')
            .from('party')
            .then(function (parties) {
                let partiesOut = {};

                parties.forEach(function (party) {
                    partiesOut[party.name.toLowerCase()] = party.id;
                });

                cb(null, partiesOut);
            }, err => cb(err))
            .catch(err => cb(err))
    },
    function (parties, cb) {
        async.forEachSeries(donationYears, function (year, doneFile) {
            let data = fs.readFileSync(__dirname + '/../data/donators_'+ year +'.csv').toString();
            console.log('Getting year', year);


            csv(data.toString(), {delimiter: ','}, function (csvErr, data) {
                if (csvErr) {
                    doneFile(csvErr);
                    return;
                }

                let partyIndexes = {};

                async.forEachOfSeries(data, function (row, i, done) {

                    if (i === 0) {
                        row.forEach(function (partyName, i) {
                            partyName = partyName.toLowerCase();
                            if (parties[partyName]) {
                                partyIndexes[i] = parties[partyName];
                            }
                        });
                        done();
                        return;
                    }

                    let name = row[0].split('(')[0].trim().split(' ');

                    let first_name = name.shift();
                    let last_name = name.join(' ');

                    let birthday = row[0].slice(-11, -1).split('.');
                    let birthdayDate = new Date(birthday[2], birthday[1], birthday[0]);
                    let bDay = birthdayDate.toISOString().substring(0, 10);
                    let halfIdentificationCode =
                        birthdayDate.getFullYear().toString().slice(-2)
                        +''+ (0 +''+ (birthdayDate.getMonth())).slice(-2)
                        +''+ (0 +''+ birthdayDate.getDate()).slice(-2);


                    console.log('Inserting info', bDay, halfIdentificationCode);
                    // start the DB magic
                    // first check if this person might exist
                    let memberId = null;
                    let q = db('person')
                        .select()
                        .where({
                            first_name: first_name,
                            last_name: last_name
                        })
                        .where(function() {
                            this
                                .where('personal_identification', 'like', '%'+ halfIdentificationCode +'%')
                                .orWhere('half_personal_identification', halfIdentificationCode);
                        });


                        q
                            .then(function (person) {
                                if (person.length) {
                                    memberId = person[0].id;
                                    return db('person')
                                        .where({id: memberId})
                                        .update({
                                            birthday: bDay,
                                            half_personal_identification: halfIdentificationCode,
                                            donator: 1
                                        });
                                } else {
                                    return db('person')
                                        .insert({
                                            first_name: first_name,
                                            last_name: last_name,
                                            birthday: bDay,
                                            half_personal_identification: halfIdentificationCode,
                                            donator: true
                                        })
                                }
                            })
                            .then(function (mId) {
                                if (!memberId) {
                                    memberId = mId[0];
                                }

                                let inserts = [];
                                row.forEach(function (donationRow, i) {
                                    let amount = parseInt(donationRow.trim().split(' ').join(''));

                                    if (i === 0 || !partyIndexes[i] || !amount) {
                                        return;
                                    }

                                    inserts.push({
                                        party_id: partyIndexes[i],
                                        member_id: memberId,
                                        amount: amount,
                                        year: year
                                    });
                                });

                                return  db('donation')
                                    .insert(inserts);
                            })
                            .then(() => done(), (err) => done(err))
                            .catch((err) => done(err));
                }, (err) => doneFile(err));
            });
        }, (err) => cb(err));
    }
], function (err) {
    if (err) {
        log.error({err: err}, 'Donators import failed')
    }

    log.info('Import finished');
});