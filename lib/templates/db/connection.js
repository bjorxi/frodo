var mongoose = require('mongoose');

/**
 * Require databse configuration depending on environment
 */
var conf = require('../config/database.js')[ENV],
    util = require('./util'),
    options = {};

var connectionString = util.createConnectionString(conf);


if (conf.replicaSet) {
  options.replset = conf.replicaSet;
}


mongoose.connect(connectionString, options);
