'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const BANNED = [
  'index.js',
  '*example',
  'package.json',
  '*__'
];

function loadFile(targetDir, encoding = 'utf-8') {
  return fs.readFileSync(targetDir, encoding);
}

/**
 * loadDirectory loads whole directory as an object and exports it from module
 * @param  {String} fileList    List of all files(and directories) from current dir
 * @param  {String} dir         Resolved path from which files will be required
 * @param  {Object} options     Options object
 * - {Regexp} re                Regexp to match for files
 * - {Boolean} recursive        Should it go recursively over all directories
 * - {String} type              File type/extension
 * @return {Object}             Returns a dictionary of all required files.
 */
function loadDirectory(fileList, dir, options) {
  const results = {};
  _.remove(fileList, (item) => {
    var found = _.find(BANNED, function (value) {
      if (value[0] === '*') {
        return item.search(value.substring(1)) !== -1;
      }
      return value === item;
    });
    if (found) {
      return item;
    }
    return undefined;
  });

  _.forEach(fileList, function (file) {
    const pathToFile = `${dir}/${file}`;
    const stat = fs.lstatSync(pathToFile);
    if (stat && stat.isDirectory() && options.recursive) {
      _.extend(results, loadDirectory(fs.readdirSync(pathToFile), pathToFile, options));
    } else {
      if (!_.isNull(file.match(options.re))) {
        var fileName = file.replace(options.type, '');
        if (options.require) {
          results[fileName] = require(pathToFile);
        } else {
          results[fileName] = loadFile(pathToFile);
        }
      }
    }
  });

  return results;
}


/**
 * prepareFunction prepares request for the directory loading.
 * @param  {String}     destinationDir  Relative path to the directory to load
 * @param  {Options}    required        Options object
 * -       {String}     type            File extension to load
 * -       {String}     currentDir      __dirname
 * -       {Boolean}    recursive      Should it load recursively, or just flat
 * @return {function}   Callbacks helper function, loadDirectory
 */
function prepareFunction(destinationDir, required) {
  if (!required.type) throw new ReferenceError("You didn't specify file type/extension!");
  if (!required.currentDir || !destinationDir) {
    throw new ReferenceError("You didn't specify directories in loadDirectory!");
  }

  const re = new RegExp(`.+[${required.type}]`, 'g');
  const dir = path.resolve(required.currentDir, destinationDir);
  const fileList = fs.readdirSync(dir);

  return loadDirectory(fileList, dir, {
    type: required.type,
    recursive: required.recursive,
    re: re,
    require: !_.isUndefined(required.require) ? required.require : true
  });
}
module.exports = prepareFunction;
