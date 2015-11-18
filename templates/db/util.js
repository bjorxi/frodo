/**
 * Creates mongodb's connection string
 */
var createConnectionString = function (conf) {
  'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]';
  var str = 'mongodb://';

  if (conf.user && conf.password)
    str = str+conf.user + ':' + conf.password + '@';

  conf.servers.forEach(function (v, i, a) {
    var host = v[0],
        port = v[1];

    str = str+host+':'+port;

    if (i < conf.servers.length-1) {
      str=str+',';
    }
  });

  if (!conf.database || typeof conf.database !== "string" || conf.database.length === 0) {
    console.error('=> Database name should be nonempty string');
    process.exit(1);
  }

  str = str + '/' + conf.database;

  return str;
};


module.exports = {
  createConnectionString: createConnectionString
}