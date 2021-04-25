/*  */

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

module.exports = {cleanString, getOptionName, getPropertiesByType, getPropertiesByProperty};
