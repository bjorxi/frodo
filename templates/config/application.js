var express = require('express'),
    app = express();


global.ENV = process.env.NODE_ENV || 'development';
console.log('=> NODE_ENV:', ENV);

/**
 * Add middleware here
 *
 * Example:
 *    app.use(bodyParser.json());
 *    app.use('/public', express.static('public'));
 */

module.exports = app;