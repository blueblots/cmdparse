/* cmdparse - Node.js command line argument parser.
 * 
 * Copyright (c) 2020-2021 Elizabeth M. <63152708+blueblots@users.noreply.github.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

function extractPropertiesFromObjects(objects, property) {
  /* Return array of properties matching property from objects. */
  let result = [];
  for (let i = 0; i < objects.length; i++) {
    if (objects[i][property] !== undefined) {
      result.push(objects[i][property]);
    }
  }
  return result;
}

function getPropertiesByType(object, constructor) {
  /* Return array of properties of 'object'
   * that are instances of 'constructor' */
  let result = [];
  Object.getOwnPropertyNames(object).forEach(prop => {
    if (object[prop] instanceof constructor) {
      result.push(object[prop]);
    }
  });
  return result;
}

function getPropertiesByProperty(object, property, value=true) {
  /* Return array of properties of 'object'
   * that themselves possess 'property' equal to 'value'. */
  let result = [];
  Object.getOwnPropertyNames(object).forEach(prop => {
    if (object[prop][property] === value) {
      result.push(object[prop]);
    }
  });
  return result;
}

function cleanString(string, dirt) {
  return string.slice(string.lastIndexOf(dirt) + 1);
}

function getOptionName(name) {
  /* Return a string version of an option name. */
  if (name instanceof Array) {
    return cleanString(name.slice(-1)[0], '-');
  } else {
    return cleanString(name, '-');
  }
}

function formatHelp(names, descriptions, padding, offset) {
  /* Align help output. */
  let result = '';
  for (let i = 0; i < names.length; i++) {
    result += names[i].toString().padEnd(offset - descriptions[i].length, padding) + descriptions[i].toString() + '\n';
  }
  return result;
}

module.exports = {formatHelp, cleanString, getOptionName, getPropertiesByType, getPropertiesByProperty, extractPropertiesFromObjects};
