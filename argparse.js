// vargs - minimal JavaScript argument parser.

/* first get the args you want to accept and add them to an vargs object.
   when ready use parseArgs with an appropriate argument to interpret a list as arguments.
*/

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
    return cleanString(name.slice(-1)[0], '-');
  } else {
    return cleanString(name, '-');
  }
}

class vargs {
  constructor() { // TODO add ability to add arguments heer
    /* if (args !== undefined) {
      for (let i = 0; i < args.length; i++) {
        addArg(args[i])
      }
    } else { */
    this.argList = [];
    this.posCount = 0;
    this.optCount = 0;
  }
  
  addArg(name, positional=true, value=null, required=true, flag=true) {
    let newArg = Object.create(null);
    if (positional) {
      newArg.type = 'pos';
      newArg.position = this.posCount;
      this.posCount += 1;
    } else {
      if (flag) {
        newArg.switch = true;
      } else {
        newArg.switch = false;
      }
      newArg.type = 'opt';
      this.optCount += 1;
    }
    newArg.name = name;
    newArg.value = value;
    newArg.required = required;
    this.argList.push(newArg);
  }
  
  delArg(name) {
    for (let i = 0; i < this.argList.length; i++) {
      if (this.argList[i].name === name) {
        this.argList.splice(this.argList.indexOf(this.argList[i]), 1);
        return true;
      }
    }
    return false;
  }
  
  get getPositionals() {
    return this.argList.filter(obj => obj.type === 'pos');
  }
  
  get getOptions() {
    return this.argList.filter(obj => obj.type === 'opt');
  }
  
  get getRequired() {
    return this.argList.filter(obj => obj.required === true);
  }
  
  // ? get switches ? get nulls
  
  verifyOption(input) {
    for (let i = 0; i < this.argList.length; i++) {
      if (this.argList[i].name instanceof Array/*.includes(input)*/) {
        if (this.argList[i].name.includes(input)) {
          return this.argList[i];
        }
        //return this.argList[i];
      }
    }
    return false;
  }
  
  verifyPositional(inputPosition) {
    for (let i = 0; i < this.argList.length; i++) {
      if (this.argList[i].position === inputPosition) {
        return this.argList[i];
      }
    }
    return false;
  }
  
  verifyRequired(input) {
    // check required arguments are available
    let count = 0;
    let required = this.getRequired;
    console.log(required);
    required.forEach(req => {
      if (input.has(req.name) || input.has(getOptionName(req.name))) { count = count + 1; }
      console.log('verifyRequired', req.name, input, count, required.length);
    });
    if (count !== required.length) {
      return false;
    } else {
      return true;
    }
  }
  
  isOptionValue(input, value) {
    // check that a positional argument's value is not identical to an option's value
    let options = this.getOptions;
    let optionName;
    for (let i = 0; i < options.length; i++) {
      optionName = getOptionName(options[i].name);
      //if (Object.keys(input).indexOf(optionName) !== -1) {
      if (input.has(optionName)) {
        if (input.get(optionName) === value) {
          return true;
        }
      }
    }
    return false;
  }
  
  parseArgs(inputList) {
    console.log('start parse');
    let arg;
    let currentInput;
    //let result = Object.create(null);
    let result = new Map();
    for (let i = 0; i < inputList.length; i++) {
      console.log('looping');
      currentInput = inputList[i];
      arg = this.verifyOption(currentInput);
      console.log(currentInput, arg);
      if (arg !== false) {
        console.log('found option');
        if (arg.switch === true) { // if arg is a switch
          console.log('option is switch');
          result.set(getOptionName(arg.name), arg.value);
          console.log(result);
          continue;
        }
        if (inputList[i + 1] === undefined) { // if theres nothing in front
          console.log('nothing in front');
          if (arg.value === null) { // if arg has no default
            console.log('no default value');
            continue;
          } else {
            console.log('using default value');
            result.set(getOptionName(arg.name), arg.value);
            console.log(result);
          }
        } else { // something is in front
          console.log('something in front');
          if (!this.verifyOption(inputList[i + 1])) { // if something isn't an option
            console.log('something is not an option');
            result.set(getOptionName(arg.name), inputList[i + 1]);
            console.log(result);
            continue;
          }
        }
      }
      arg = this.verifyPositional(inputList.indexOf(currentInput));
      if (arg !== false) {
        console.log('found positional');
        console.log(currentInput);
        if (!this.verifyOption(currentInput)) {
          if (this.isOptionValue(result, currentInput)) {
            console.log('positional value is an options value; skipping');
            console.log(result, currentInput);
            continue;
          }
          //console.log('positional is not an option, nor is its value an options value');
          result.set(arg.name, currentInput);
          console.log(result);
          continue;
        } else {
          continue;
        }
      }
    }
    //console.log('checking requireds');
    if (this.verifyRequired(result) === false) {
      return false;
    }
    // ensure that default options are specified
    this.getOptions.forEach(option => {
      if (option.switch !== false && result.get(getOptionName(option.name)) === undefined) {
        result.set(getOptionName(option.name), false);
      }
    });
    return result;
  }
  
}

let a = new vargs();
a.addArg('huluhoop', true);
a.addArg('hoophulu', true);
a.addArg(['-v', '--verbose'], false, 'TRUE', false, true);
a.addArg(['-c', '--cola'], false, 'coca', false, false);
a.addArg(['-b', '--boo'], false, null, true, false);
console.log(a);

let j = a.parseArgs(process.argv.slice(2));

console.log('result :', j);

