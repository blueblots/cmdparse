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

module.exports = {inNestedObject, cleanString, getOptionName};
