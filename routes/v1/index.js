'use strict';

let express = require('express');

module.exports = function () {
    let app = express.Router();

    app.use('/person', require('./person')());
    app.use('/party', require('./party')());
    app.use('/procurement', require('./procurement')());

    return app;
};