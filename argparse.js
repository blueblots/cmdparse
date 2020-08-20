// argparse.js - JavaScript argument parser.

// TODO add optional type verification


/* first get the args you want to accept and add them to an vargs object.
   when ready use parseArgs with an appropriate argument to interpret a list as arguments.
*/

/* arg = object.create(null)
 * arg = {
 *  name: string | array
 *  type: any
 *  value: null | default
 *  required: true | false
 * }
 
 */

function inNestedSequence(target, sequence) {
  for (let i of sequence) {
    if (i.indexOf(target) !== -1) {
      return true;
    } else {
      continue;
    }
  }
  return false;
}

function cleanString(string, dirt) {
  return string.slice(string.lastIndexOf(dirt) + 1);
}

function getOptionName(name) {
  /* if name is an object, it is assumed to be an array
   * where the last element is the name.
   * otherwise name is assumed to be a string. */
  if (typeof(name) === 'object') {
    return cleanString(name.slice(-1)[0], '-');
  } else {
    return cleanString(name, '-');
  }
}


class vargs {
  constructor() { // TODO add ability to add arguments heer
    this.positionals = new Map();
    this.optionals = new Map();
  }
  
  addPositional(name, position) {
    this.positionals.set(name.toString(), position);
  }
  
  addOptional(names, defaultValue=null) {
    this.optionals.set(names, defaultValue);
  }
  
  removePositional(name) {
    this.positionals.delete(name);
  }
  
  removeOptional(name) {
    let n = getOptionName(name);
    this.optionals.delete(n);
  }
  
  parseArgs(list) {
    let element;
    let name;
    let value;
    let arglist = new Map();
    console.log('start parse');
    for (let i = 0; i < list.length; i++) {
      element = list[i];
      console.log('element', element);
      if (/^-+/.test(element)) { // if element begins with - or --
        console.log('element is an option...');
        for (let names of this.optionals.keys()) {
          console.log(names, this.optionals.keys());
          if (names.indexOf(element) !== -1) {
            console.log('match with element', names[names.indexOf(element)]);
            if (list[i + 1] === undefined) { // if there's nothing in front of the option
              console.log('nothing up front');
              if (this.optionals.get(names) !== null) {
                console.log('theres a default value');
                name = cleanString(names.slice(-1)[0], '-'); // this removes the leading dashes
                value = this.optionals.get(names); // the default value
                console.log(name, value);
                arglist.set(name, value);
              } else { // no default value
                continue;
              }
            } else if (list[i + 1] !== undefined) { // if there's something in front of the option
              console.log('something in front');
              if (!inNestedSequence(list[i + 1], this.optionals.keys())) { // if the something is not in the list of option names
                console.log('something is not an option name');
                name = cleanString(names.slice(-1)[0], '-'); // this removes the leading dashes
                value = list[i + 1]; // the next item that isn't another option or undefined
                console.log(name, value);
                arglist.set(name, value);
              } else if (this.optionals.get(names) !== null) { // if the something is in the option names and the option has a default value
                console.log('something is an option name; using default');
                name = cleanString(names.slice(-1)[0], '-'); // this removes the leading dashes
                value = this.optionals.get(names); // the default value
                console.log(name, value);
                arglist.set(name, value);
              }
            } else { // option has no default and has no value
              continue;
            }
          }
        }
      }
      else { // for positional elements
        console.log('element is positional');
        for (let name of this.positionals.keys()) {
          console.log(name, this.positionals.keys());
          console.log(list.indexOf(element), this.positionals.get(name));
          if (list.indexOf(element) === this.positionals.get(name)) {
            value = list[i];
            console.log(value);
            arglist.set(name, value);
          }
        }
      }
    } //check if all positional arguments are present
    if (arglist.size < this.positionals.size) {
      throw 'ARGPARSE: error: missing positional parameters';
    } else if (arglist.size !== this.positionals.size + this.optionals.size) { // if arglist isn't full, populate default arguments
      for (let arg of this.optionals.keys()) {
        name = cleanString(arg.slice(-1)[0], '-');
        value = this.optionals.get(arg);
        if (!arglist.has(name) && value !== null) {
          arglist.set(name, value);
        }
      }
    }
    return arglist;
  }
  
}


a = new vargs();
a.addPositional('hocus', 0);
a.addPositional('pocus', 1);
a.addOptional(['-v', '--verbose'], false);
a.addOptional(['-a', '--abracadabra'], 42);
a.addOptional(['-o', '--output']);

console.log(a);

a.removeOptional('abracadabra');
a.removePositional('pocus');

console.log(a);

b = a.parseArgs(process.argv.slice(2));
console.log(b);
