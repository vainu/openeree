'use strict';

let express = require('express');

module.exports = function () {
    let app = express.Router();

    // Attach correct version to correct route
    app.use('/v1', require('./v1')());

    return app;
};