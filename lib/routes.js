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


function appendNewRequire (lines, lastRequireLineNum, controller) {
  var newLine = "    "+controller+" = require(../app/controllers/"+ controller +");"
  lines[lastRequireLineNum] = lines[lastRequireLineNum].replace(";", ",");
  lines.splice(lastRequireLineNum+1, 0, newLine);
}


module.exports = function (shortName, fullName, methods) {
  console.log($ROUTES_FILE);
  var lines = fs.readFileSync($ROUTES_FILE, {encoding: 'utf-8'}).split('\n'),
      linesNum = lines.length;

  var lastRequireLineNum = findPlaceForRequire(lines, linesNum);
  appendNewRequire(lines, lastRequireLineNum, controller);
}