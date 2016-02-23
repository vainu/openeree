'use strict';
/**
 * Party metadata import
 */

let async = require('async');
let log = require('../lib/log');
let db = require('../lib/db');
let metadata = require('../data/party_metadata.json');


async.forEachOf(metadata, function (partyData, partyName, partyDone) {
    // get party id
    db('party')
        .select()
        .where({ name: partyName })
        .then(function (party) {
            if (!party.length || !party[0].id) {
                partyDone('Unable to find party');
                return;
            }

            let partyId = party[0].id;

            async.forEachOf(partyData, function (value, field, metaDone) {
                if (value === "") {
                    value = db.fn.NULL;
                }

                db('party_metadata').insert({
                    party_id: partyId,
                    field: field,
                    value: value
                }).then(function () {
                    metaDone();
                }, function (err) {
                    metaDone(err);
                }).catch(function (err) {
                    metaDone(err);
                })
            }, function (err) {
                partyDone(err);
            });
        }, function (err) {
            partyDone(err);
        }).catch(function (err) {
            partyDone(err);
        });

}, function (err) {
    if (err) {
        log.error({err: err}, 'Import failed');
        return;
    }

    log.info('Import successfully done');
});
