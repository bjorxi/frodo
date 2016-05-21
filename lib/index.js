/**
 * Frodo.js is a app generator for Express-based aplications.
 * Easily set structure in a json file and pass path for the file as command line argument
 */

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var fs = require('fs'),
    exec = require('child_process').execSync,
    /* path is actively used, so I made Python like name */
    os = {path: require('path')},
    pluralize = require('./pluralize'),
    generateRoutes = require('./routes');


var $WORKING_DIR = process.cwd(),
    $APPNAME = null,
    $SKIP_VIEWS = false,
    $SKIP_ASSETS = false,
    $SCAFFOLD = false,
    $APP = os.path.join($WORKING_DIR, 'app'),
    $ASSETS = os.path.join($APP, 'assets'),
    $CONTROLLERS = os.path.join($APP, 'controllers'),
    $MODELS = os.path.join($APP, 'models');
    $VIEWS = os.path.join($APP, 'views'),
    $VERSION = '0.5.0',
    $PREPROCESSORS = {
      views: 'pug',
      stylesheets: 'css',
      javascripts: 'js'
    },
    $SCHEMA_TYPES = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'Objectid', 'Array'];


var skipViewsItems = ['assets', 'views', 'vendor', 'public'];


/**
 * Project structure
 */
var skeleton = {
  files: ['index.js', '.gitignore'],
  app: {
    assets: {
      images: {files: ['.keep']},
      javascripts: {files: ['application.js']},
      stylesheets: {files: ['application.css']}
    },
    controllers: {files: ['welcome_controller.js']},
    models: {files: ['.keep']},
    views: {
      layouts: {files: ['application.pug']},
      welcome: {files: ['index.pug']}
    },
    helpers: {files: ['.keep']}
  },
  bin: {files: ['.keep']},
  config: {
    environments: {files: ['development.js', 'test.js', 'production.js']},
    files: ['application.js', 'environment.js', 'database.js', 'routes.js', 'globals.js']
  },
  db: {files: ['.keep', 'connection.js', 'util.js']},
  lib: {files: ['.keep']},
  log: {files: ['.keep']},
  middleware: {
    files: ['.keep']
  },
  public: {
    files: ['404.jade', '500.jade', 'favicon.ico', 'robots.txt']
  },
  test: {
    controllers: {files: ['.keep']},
    models: {files: ['.keep']},
    helpers: {files: ['.keep']}
  },
  tmp: {files: ['.keep']},
  vendor: {
    javascripts: {files: ['.keep']},
    stylesheets: {files: ['.keep']}
  }
};

/**
 *
 */
function useTemplate(path, locals) {
  var fileName = path.split($APPNAME).pop().replace('/', ''),
      template = os.path.join(__dirname, 'templates', fileName);

  if (fs.existsSync(template)) {
    fs.createReadStream(template).pipe(fs.createWriteStream(path));
    return true;
  }
}


function createFile(path, content) {
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
}


function createFiles(files, path) {
  var file = null;

  for (var i = 0; i < files.length; i++) {
    file = files[i];
    createFile(os.path.join(path, file));
  }
}


/**
 * Checks if argument is object
 *
 * @method isObject
 * @param {Any} obj value to be checked
 * @return Boolean
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}


/**
 * Generates project folders structure
 */
function generateSkeleton(skeleton, path) {
  for (key in skeleton) {
    if (skeleton.hasOwnProperty(key)) {
      if ($SKIP_VIEWS && skipViewsItems.indexOf(key) >= 0) {
        continue;
      }

      if (isObject(skeleton[key])) {
        console.log('Creating folder', os.path.join(path, key));
        fs.mkdirSync(os.path.join(path, key));
        generateSkeleton(skeleton[key], os.path.join(path, key));
      } else if (key === 'files') {
        createFiles(skeleton.files, path);
      }
    }
  }
}


function generatePackageJson(projectPath, appName) {
  var packageJson = '{\n'+
                    '  "name": "'+appName+'",\n'+
                    '  "version": "0.0.1",\n'+
                    '  "description": "",\n'+
                    '  "main": "index.js",\n'+
                    '  "license": "ISC"\n'+
                    '}';

  createFile(os.path.join(projectPath, 'package.json'), packageJson)
}


function npmInit(projectPath) {
  console.log('Installing depencies');
  process.chdir(projectPath);
  console.log('Running: npm install express --save');
  exec('npm install express --save');
  console.log('Running: npm install body-parser --save');
  exec('npm install body-parser --save');
  console.log('Running: npm install mongoose --save');
  exec('npm install mongoose --save');
  console.log('Running: npm install async --save');
  exec('npm install async --save');

  if (!$SKIP_VIEWS) {
    console.log('Running: npm install pug --save');
    exec('npm install pug --save');
  }
}


/**
 *
 */
function getControllerContents (name, methods) {
  var contents = '';

  contents += 'var '+name.capitalize()+'Controller = (function () {\n';
  contents += '  return {\n';

  for (var i = 0; i < methods.length; i++) {
    contents += '    '+methods[i]+': function (req, res) {}';

    if (i != methods.length - 1) {
      contents += ',\n';
    } else {
      contents += '\n';
    }
  }

  contents += '  }\n';
  contents += '}());\n\n';
  contents += 'module.exports = '+name.capitalize()+'Controller;\n';
  return contents;
}


/**
 * Generates a new controller. If $SKIP_VIEWS is false, generateViews will be executed.
 * Views folder name is first argument of the generateController function, views names the same as
 * methods.
 *
 * ! For now routes would not be generated automatically. This feature is on the road map
 *
 * @method generateController
 * @param {String} name controller name
 * @param {Array} methods a list of methods to be added to the controller
 */
function generateController(name, methods) {
  var pluralName = pluralize(name),
      fullName = pluralName+'_controller.js',
      contents = getControllerContents(pluralName, methods);

  createFile(os.path.join($CONTROLLERS, fullName), contents);

  if (!$SKIP_VIEWS && methods) {
    generateViews(pluralName, methods);
  }

  if (!$SKIP_ASSETS) {
    generateAssets(pluralName);
  }

  generateRoutes(pluralName, fullName, methods, $SCAFFOLD);
}


/**
 * Generates javascript and stylesheet files.
 *
 * @method generateAssets
 *
 * @param {String} name name of file as is.
 */
function generateAssets(name) {
  var js = os.path.join($ASSETS, 'javascripts', name+'.'+$PREPROCESSORS.javascripts),
      css = os.path.join($ASSETS, 'stylesheets', name+'.'+$PREPROCESSORS.stylesheets);

  createFile(js);
  createFile(css);
}


function getDefaultViewContent (viewPath) {
  return "extends ../layouts/application.pug\n\n" +
         "block content\n"+
         "  p You can find this view template at "+viewPath;
}


/**
 * Generates new views
 *
 * @method generateViews
 *
 * @param {String} dirName a directory for new views
 * @param {Array} methods a list of views to be generated
 */
function generateViews(dirName, views) {
  var viewsPath = os.path.join($VIEWS, dirName),
      view = null;

  /* If views directory does not exist - skip this step */
  if (!fs.existsSync($VIEWS)) {
    return;
  }

  if (!fs.existsSync(os.path.join($VIEWS, dirName))) {
    fs.mkdirSync(os.path.join($VIEWS, dirName));
  }

  for (var i = 0; i < views.length; i++) {
    /* Don't create views in the array if scaffold has been called */
    if ($SCAFFOLD && ['create', 'update', 'delete'].indexOf(views[i]) >= 0 ) {
      continue;
    }

    view = views[i]+'.'+$PREPROCESSORS.views;

    var content = getDefaultViewContent(os.path.join(viewsPath, view));
    createFile(os.path.join(viewsPath, view), content);
  }
}


/**
 * Generates mongoose compatible schema object.
 *
 * @method createMongooseSchema
 *
 * @param {Array} props - an array of model properties. Each item is a string 'name:type:required' 
 *                        where only 'name' is required part. If type is omitted, then the default
 *                        value (String) will be used.
 */
function createMongooseSchema(props) {
  var schema = "";

  props.forEach(function (val, i) {
    splitted = val.split(':');
    var name = splitted[0],
        type = splitted[1],
        required = splitted[2];

    if (splitted.length === 2 && type === 'true') {
      type = null;
      required = 'true';
    }

    if (!type) {
      type = 'String';
    }

    if ($SCHEMA_TYPES.indexOf(type.capitalize()) < 0) {
      console.error('Unknown type', type, 'for', name);
      process.exit(1);
    }

    schema += "  "+name+": {type: "+type.capitalize();

    if (required === 'true') {
      schema += ", required: true";
    }

    schema += "},\n";
  });

  schema += "  created_at: {type: Number, required: true, default: new Date().getTime()},\n";
  schema += "  updated_at: {type: Number, required: true, default: new Date().getTime()}\n";

  return schema;
}


/**
 * Generates a new model
 *
 * @method generateModel
 *
 * @param {String} name model name
 * @prop {Array} props an array of properties. A property of collon seperated strings.
 * propName:propType:required:defaultValue. Example: login:string:required,
 * created_at:date:required:now
 *
 */
function generateModel(name, props) {
  var schema = createMongooseSchema(props),
      nameCap = name.capitalize(),
      schemaName = nameCap+"Schema";

  /* If models directory does not exist - skip this step */
  if (!fs.existsSync($MODELS)) {
    return;
  }

  var code = "var mongoose = require('mongoose'),\n"+
    "    ObjectId = mongoose.Schema.Types.ObjectId,\n"+
    "    Mixed = Schema.Types.Mixed;\n\n"+
    "var "+schemaName+" = mongoose.Schema({\n"+
    schema+
    "});\n\n"+
    "var "+nameCap+" = mongoose.model('"+nameCap+"', "+schemaName+");\n\n"+
    "module.exports = "+nameCap+";\n";

  createFile(os.path.join($MODELS, name+'.js'), code);
}


/**
 * ------ THIS FEATURE NOT AVAILABLE --------
 * Use your favorite preprocessors with frodo generators. In order to configure preprocessors
 * add module.exports.preprocessors into config/application. If preprocessors are not set frodo
 * will use default values: jade for views, css for stylesheets, js for scripts. If any value is
 * missed, frodo will use default for this as well.
 *
 * /!\ This settigns do not set your assets pipeline. Such a feature is on the roadmap. Don't forget
 * to set preprocessing of your assets.
 *
 * Example ('config/application.js'):
 *  module.exports.preprocessors = {
 *    views: 'jade',
 *    stylesheets: 'scss',
 *    javascripts: 'coffee'
 *  }
 */
function setPreprocessors() {
  var preprocessors = null;

  try {
    preprocessors = require(os.path.join($WORKING_DIR, 'config/application')).preprocessors;
  } catch (e) {
    console.log("Can't find config/application.js");
  }

  if (!preprocessors) {
    return;
  } else {
    if (preprocessors.views) {
      $PREPROCESSORS.views = preprocessors.views;
    }

    if (preprocessors.stylesheets) {
      $PREPROCESSORS.stylesheets = preprocessors.stylesheets;
    }

    if (preprocessors.javascripts) {
      $PREPROCESSORS.javascripts = preprocessors.javascripts;
    }
  }
}


/**
 * Parses command line arguments and if they are correct, call required action.
 *
 * @method main
 */
function main () {
  var argv = process.argv;

  if (!fs.existsSync($ASSETS)) {
    $SKIP_ASSETS = true;
  }

  setPreprocessors();

  if (argv.length === 2) {
    console.log('too few arguments');
    return;
  } else if (argv[2] === 'new') {
    if (argv.length === 3) {
      console.log('Usage: frodo new project_name. Example: frodo new blog');
    } else {
      $APPNAME = argv[3];
      var projectPath = os.path.join($WORKING_DIR, argv[3]);
      fs.mkdirSync(projectPath);

      if (argv.indexOf('--skipViews') >= 0) {
        $SKIP_VIEWS = true;
      }

      generateSkeleton(skeleton, projectPath);
      generatePackageJson(projectPath, argv[3]);
      npmInit(projectPath);
    }
  } else if (argv[2] === 'generate') {
    $APPNAME = process.cwd().split('/').pop();

    if  (argv.length < 5) {
      console.log('Usage: frodo generate controller controller_name.'+
                  'Example: frodo generate controller users');
      return;
    }
    if (argv[3] === 'controller') {
      generateController(argv[4], argv.slice(5));
    } else if (argv[3] === 'model') {
      generateModel(argv[4], argv.slice(5));
    } else if (argv[3] === 'scaffold') {
      $SCAFFOLD = true;
      generateController(argv[4], ['index', 'show', 'new', 'edit', 'create', 'update', 'delete']);
      generateModel(argv[4], argv.slice(5));
    }
  } else if (argv[2] === 'server') {
    try {
      exec('node index.js', {stdio: 'inherit'});
    } catch (e) {
      /* TODO: add logging */
      return;
    }
  }
}

main();
