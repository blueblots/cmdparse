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

function inNestedObject(target, sequence) {
  for (let i = 0; i < sequence.length; i++) {
    if (target in sequence[i]) {
      return true;
    } else {
      continue;
    }
  }
  return false
}

function cleanString(string, dirt) {
  return string.slice(string.lastIndexOf(dirt) + 1);
}

function getOptionName(name) {
  if (name instanceof Array) {
    //console.log(name);
    return cleanString(name.slice(-1)[0], '-');
  } else {
    return cleanString(name, '-');
  }
}

module.exports = {inNestedObject, cleanString, getOptionName, getPropertiesByType, getPropertiesByProperty};
