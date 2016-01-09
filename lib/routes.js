/**
 * config/routes.js manipulations
 */

var fs = require('fs'),
    path = require('path');

var $ROUTES_FILE = path.join(process.cwd(), 'config/routes.js');


function findPlaceForRequire (lines, linesNum) {
  var lastRequireLineNum = 0,
      line = null;

  for (var i = 0; i < linesNum; i++) {
    line = lines[i];

    if (line.indexOf('controller') >= 0) {
      lastRequireLineNum = i;
    }
  }

  return lastRequireLineNum;
}


function addNewRequire (lines, lastRequireLineNum, name, fullName) {
  var newLine = "    "+name+" = require('../app/controllers/"+ fullName +"');"
  lines[lastRequireLineNum] = lines[lastRequireLineNum].replace(";", ",");
  lines.splice(lastRequireLineNum+1, 0, newLine);
}


function addRoutes (lines, controller, methods) {
  var method = null;

  for (var i = 0; i < methods.length; i++) {
    method = methods[i];
    lines.push("app.get('/"+controller+"/"+method+"', "+controller+"."+method+");");
  }
}


function addScaffoldRoutes (lines, controller) {
  lines.push("app.get('/"+controller+"/index', "+controller+".index);");
  lines.push("app.get('/"+controller+"/new', "+controller+".new);");
  lines.push("app.post('/"+controller+"/create', "+controller+".create);");
  lines.push("app.get('/"+controller+"/:id/edit', "+controller+".edit);");
  lines.push("app.get('/"+controller+"/:id', "+controller+".show);");
  lines.push("app.put('/"+controller+"/:id', "+controller+".update);");
  lines.push("app.delete('/"+controller+"/:id', "+controller+".delete);");
}


module.exports = function (name, fullName, methods, scaffold) {
  var lines = fs.readFileSync($ROUTES_FILE, {encoding: 'utf-8'}).split('\n'),
      linesNum = lines.length;

  var lastRequireLineNum = findPlaceForRequire(lines, linesNum);

  addNewRequire(lines, lastRequireLineNum, name, fullName);

  if (scaffold) {
    addScaffoldRoutes(lines, name);
  } else if (methods) {
    addRoutes(lines, name, methods);
  }

  fs.writeFileSync($ROUTES_FILE, lines.join('\n'), {encoding: 'utf-8'});
}
