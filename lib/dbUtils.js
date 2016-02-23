'use strict';

let config = require('easy-config');
let async = require('async');

module.exports = {
    applyTransformations: applyTransformations,
    sendResponse: sendResponse
};

/**
 * Limits output, defaults to config value
 * @param req
 * @returns {*}
 * @private
 */
function _limit(req) {
    let limit = +req.query.limit;
    if (limit && Number.isInteger(limit)) {
        return limit;
    }

    return config.db.defaultLimit;
}

/**
 * Selects only given fields on query. knex will throw if invalid fields are specified
 * @param req
 * @returns {*}
 * @private
 */
function _select(req) {
    let fields = req.query.fields;

    if (fields) {
        return fields.split(',');
    }

    return undefined;
}

/**
 * Offsets query, checking number
 * @param req
 * @returns {number}
 * @private
 */
function _offset(req) {
    let offset = +req.query.offset;
    if (offset && Number.isInteger(offset)) {
        return offset;
    }

    return 0;
}

/**
 * Converts comma separated list into array of ordering objects
 * desc can be given with - before the field
 * ex: first_name,-last_name
 *
 * @param req
 * @returns {*}
 * @private
 */
function _order(req) {
    let order = req.query.order;

    if (order) {
        let orderings = order.split(',');

        orderings = orderings.map(function (ordering) {
            if (ordering.substr(0,1) === '-') {
                return {field: ordering.slice(1), direction: 'desc'};
            }

            return {field: ordering, direction: 'asc'};
        });
        return orderings;
    }

    return [];
}

/**
 * Apply all transformations to the query
 * @param q
 * @param req
 */
function applyTransformations(q, req) {
    q.limit(_limit(req));
    q.offset(_offset(req));
    q.select(_select(req));

    _order(req).forEach(function (o) {
        q.orderBy(o.field, o.direction);
    });

    req.log.trace({query: q.toString()});

    return q;
}


function handleSubquery(data, queries) {
    return new Promise(function (resolve, reject) {
        if (!data || !queries) {
            reject('Data or queries missing');
            return;
        }

        async.forEach(data, function (d, done) {
            async.forEach(queries, function (query, queryDone) {

                if (!query.q || !query.field || !query.where) {
                    queryDone('Subquery is missing params');
                    return;
                }

                let subQ = query.q.clone();

                query.whereId = query.whereId || 'id';

                subQ.where(query.where, d[query.whereId]);

                subQ.then(function (subData) {
                    let sData = subData;
                    if (typeof query.reduce === 'function') {
                        sData = subData.reduce(query.reduce, {});
                    }

                    d[query.field] = sData;

                    queryDone();
                }, function (err) {
                    queryDone(err);
                }).catch(function (err) {
                    queryDone(err);
                });



            }, function (err) {
                done(err);
            });
        }, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        })
    });
}

/**
 * Handles db query and responding to user
 * @param q
 * @param req
 * @param res
 * @param single
 * @param subQueries
 */
function sendResponse(q, req, res, single, subQueries) {
    let query = applyTransformations(q, req);

    query.then(function (data) {
        if (!data || !data.length) {
            res.sendStatus(404);
            return;
        }

        if (subQueries && subQueries.length) {
            return handleSubquery(data, subQueries)
        }

        return data;
    }).then(function (data) {
        if (single && data[0] && data.length === 1) {
            data = data[0];
        }

        res.json(data);
    }, function (err) {
        res.status(400).send(err);
    }).catch(function (err) {
        res.status(500).send(err);
    })
}