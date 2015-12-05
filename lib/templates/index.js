require('./config/globals');
var app = require('./config/application');
require('./db/connection');
require('./config/routes');


var server = app.listen(7000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('=> Express application starting on http://%s:%s', host, port);
  console.log('=> Ctrl-C to shutdown server');
});
