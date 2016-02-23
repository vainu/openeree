'use strict';

let logger = require('../lib/log');

// create tables
Promise.all([
    require('../tables/person')(),
    require('../tables/party')(),
    require('../tables/party_member')(),
    require('../tables/party_metadata')(),
    require('../tables/donation')(),
    require('../tables/company')(),
    require('../tables/company_role')(),
    require('../tables/company_employee')(),
    require('../tables/procurement')()
]).then(function (tables) {
    logger.info({tables: tables}, 'Successfully created '+ tables.length +' tables');
}, function (err) {
    logger.error({err: err}, 'Failed to create tables');
}).catch(function (err) {
    logger.fatal({err: err}, 'Fatal while creating tables');
});
