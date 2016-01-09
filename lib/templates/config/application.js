var path = require('path'),
    express = require('express'),
    app = express();


global.ENV = process.env.NODE_ENV || 'development';
console.log('=> NODE_ENV:', ENV);


app.set('view engine', 'jade');
app.set('views', path.join(ROOT, 'app/views'));
app.use('/assets', express.static(path.join(ROOT, 'app/assets')));

/**
 * Add middleware here
 *
 * Example:
 *    app.use(bodyParser.json());
 *    app.use('/public', express.static('public'));
 */

module.exports = app;
