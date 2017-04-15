/**
 * [exports description]
 * @type {Object}
 */

var fs = require('fs'),
    os = {path: require('path')},
    config = require('./config');


/**
 *
 * @param {String} path [description]
 * @param {Object} locals
 *
 * @return {Boolean}
 */
function useTemplate(path, locals) {
  var fileName = path.split(config.appname).pop().replace('/', ''),
      template = os.path.join(__dirname, 'templates', fileName);

  if (fs.existsSync(template)) {
    fs.createReadStream(template).pipe(fs.createWriteStream(path));
    return true;
  }
};


module.exports = {
  createFile: function (path, content) {
    console.log('Creating file', path);

    if (useTemplate(path)) {
      return;
    }

    if (content) {
      fs.writeFileSync(path, content);
    } else {
      file = fs.openSync(path, 'w');
      fs.closeSync(file);
    }
  },

  /**
   *
   * @param  {[type]} files [description]
   * @param  {[type]} path  [description]
   */
  createFiles: function (files, path) {
    var file = null,
        self = this;

    for (var i = 0; i < files.length; i++) {
      file = files[i];
      self.createFile(os.path.join(path, file));
    }
  }
};
