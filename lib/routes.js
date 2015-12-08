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


function appendNewRequire (lines, lastRequireLineNum, name, fullName) {
  var newLine = "    "+name+" = require('../app/controllers/"+ fullName +"');"
  lines[lastRequireLineNum] = lines[lastRequireLineNum].replace(";", ",");
  lines.splice(lastRequireLineNum+1, 0, newLine);
}


function appendMethods (lines, controller, methods) {
  var method = null;
  
  for (var i = 0; i < methods.length; i++) {
    method = methods[i];
    lines.push("app.get('/"+controller+"/"+method+"', "+controller+"."+method+");");
  }
}


module.exports = function (name, fullName, methods) {
  var lines = fs.readFileSync($ROUTES_FILE, {encoding: 'utf-8'}).split('\n'),
      linesNum = lines.length;

  var lastRequireLineNum = findPlaceForRequire(lines, linesNum);

  appendNewRequire(lines, lastRequireLineNum, name, fullName);

  if (methods) {
    appendMethods(lines, name, methods);  
  }
  
  fs.writeFileSync($ROUTES_FILE, lines.join('\n'), {encoding: 'utf-8'});


}