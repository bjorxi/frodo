var fs = require('fs'),
    path = require('path'),
    Mustache = require('mustache');


/**
 *
 * @param  {Object} options [description]
 * @return {String}         [description]
 */
function renderController (options) {
  var _path = path.join(__dirname, 'dynamic/controller'),
      text = fs.readFileSync(_path, {encoding: 'utf8'});

  return Mustache.render(text, {methods: options.methods});
}


/**
 *
 * @param  {Object} options [description]
 * @return {String}         [description]
 */
function renderModel (options) {
  var _path = path.join(__dirname, 'dynamic/model'),
      text = fs.readFileSync(_path, {encoding: 'utf8'});

  return Mustache.render(text, options);
}



module.exports = {
  /**
   * [render description]
   * @param  {String} template [description]
   * @param  {Object} options  [description]
   * @return {String}          [description]
   */
  render(template, options) {
    switch  (template) {
      case 'dynamic/controller':
        return renderController(options);
        break;
      case 'dynamic/model':
        return renderModel(options);
        break;
      default:
        console.log('Unknown template ' + template);
        return;
    }
  },
};

