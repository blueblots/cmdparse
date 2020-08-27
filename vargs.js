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

exports.vargs = class {
  constructor(...args) {
    if (args !== undefined) {
      for (let i = 0; i < args.length; i++) {
        let {name, positional, value, required, flag} = args[i];
        this.addArg(name, positional, value, required, flag);
      }
    }
  }
  
  set addArg({name, positional=true, value=null, required=true, flag=true}) {
    let newArg = Object.create(null);
    if (positional) {
      newArg.position = this.posCount;
    } else {
      if (flag) {
        newArg.flag = true;
      } else {
        newArg.flag = false;
      }
    }
    newArg.name = name;
    newArg.value = value;
    newArg.required = required;
    if (name instanceof Array) {
      this[getOptionName(name)] = newArg;
    } else {
      this[name] = newArg;
    }
  }
  
  set delArg(name) {
    delete this[name];
  }
  
  get posCount() {
    return this.positionals.length;
  }
  
  get optCount() {
    return this.options.length;
  }
  
  get reqCount() {
    return this.required.length;
  }
  
  get positionals() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].position !== undefined) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get options() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].position === undefined) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get required() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].required === true) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get flags() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].flag === true) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get values() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].value !== null) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  toMap() {
    let result = new Map();
    this.options.forEach(prop => {
      console.log(prop.name);
      result.set(getOptionName(prop.name), prop.value);
    });
    this.positionals.forEach(prop => {
      result.set(prop.name, prop.value);
    });
    return result;
  }
  
  toObject() {
    let result = {};
    this.options.forEach(prop => {
      result[getOptionName(prop.name)] = prop.value;
    });
    this.positionals.forEach(prop => {
      result[prop.name] = prop.value;
    });
    return result;
  }
  
  verifyOption(input) {
    for (let i = 0; i < this.optCount; i++) {
      if (this.options[i].name instanceof Array) {
        if (this.options[i].name.includes(input)) {
          return this.options[i];
        }
      } else if (this.options[i].name === input) {
        return this.options[i];
      }
    }
    return false;
  }
  
  verifyPositional(inputPosition) {
    for (let i = 0; i < this.posCount; i++) {
      if (this.positionals[i].position === inputPosition) {
        return this.positionals[i];
      }
    }
    return false;
  }
  /*
  verifyRequired(input) {
    // check required arguments are available
    let count = 0;
    for (let i = 0; i < this.reqCount; i++) {
      if (input.has(this.required[i].name) || input.has(getOptionName(this.required[i].name))) {
        count += 1;
      }
    }
    if (count !== this.reqCount) {
      return false;
    } else {
      return true;
    }
  }
  */
  verifyRequired(input) {
    // check required arguments are available
    let count = 0;
    for (let i = 0; i < this.reqCount; i++) {
      if (Object.keys(input).includes(this.required[i].name) || Object.keys(input).includes(getOptionName(this.required[i].name))) {
        count += 1;
      }
    }
    if (count !== this.reqCount) {
      return false;
    } else {
      return true;
    }
  }
  
  /*
  isOptionValue(input, value) {
    // check that a positional argument's value is not identical to an option's value
    let optionName;
    for (let i = 0; i < this.optCount; i++) {
      optionName = getOptionName(this.options[i].name);
      if (input.has(optionName)) {
        if (input.get(optionName) === value) {
          return true;
        }
      }
    }
    return false;
  }
  */
  isOptionValue(input, value) {
    // check that a positional argument's value is not identical to an option's value
    let optionName;
    for (let i = 0; i < this.optCount; i++) {
      optionName = getOptionName(this.options[i].name);
      if (Object.keys(input).includes(optionName)) {
        if (input[optionName] === value) {
          return true;
        }
      }
    }
    return false;
  }
  /*
  parseArgsMap(inputList) {
    console.log('start parse');
    let arg;
    let currentInput;
    let result = new Map();
    for (let i = 0; i < inputList.length; i++) {
      console.log('looping');
      currentInput = inputList[i];
      arg = this.verifyOption(currentInput);
      console.log(currentInput, arg);
      if (arg !== false) {
        console.log('found option');
        if (arg.flag === true) { // if arg is a switch
          console.log('option is flag');
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
          console.log(arg);
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
    this.options.forEach(option => {
      if (option.flag !== false && result.get(getOptionName(option.name)) === undefined) {
        result.set(getOptionName(option.name), false);
      }
    });
    return result;
  }
  
  parseArgsObject(inputList) {
    console.log('start parse');
    let arg;
    let currentInput;
    let result = {};
    for (let i = 0; i < inputList.length; i++) {
      console.log('looping');
      currentInput = inputList[i];
      arg = this.verifyOption(currentInput);
      console.log(currentInput, arg);
      if (arg !== false) {
        console.log('found option');
        if (arg.flag === true) { // if arg is a switch
          console.log('option is flag');
          result[getOptionName(arg.name)] = arg.value;
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
            result[getOptionName(arg.name)] = arg.value;
            console.log(result);
          }
        } else { // something is in front
          console.log('something in front');
          if (!this.verifyOption(inputList[i + 1])) { // if something isn't an option
            console.log('something is not an option');
            result[getOptionName(arg.name)] = inputList[i + 1];
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
          if (this.isOptionValueObj(result, currentInput)) {
            console.log('positional value is an options value; skipping');
            console.log(result, currentInput);
            continue;
          }
          //console.log('positional is not an option, nor is its value an options value');
          console.log(arg);
          result[arg.name] = currentInput;
          console.log(result);
          continue;
        } else {
          continue;
        }
      }
    }
    //console.log('checking requireds');
    if (this.verifyRequiredObj(result) === false) {
      return false;
    }
    // ensure that default options are specified
    this.options.forEach(option => {
      if (option.flag !== false && result[getOptionName(option.name)] === undefined) {
        result[getOptionName(option.name)] = false;
      }
    });
    return result;
  }
  */
  
  parseArgs(inputList) {
    //console.log('start parse');
    let arg;
    let currentInput;
    let result = new exports.vargs();
    for (let i = 0; i < inputList.length; i++) {
      //console.log('looping');
      currentInput = inputList[i];
      arg = this.verifyOption(currentInput);
      //console.log(currentInput, arg);
      if (arg !== false) {
        //console.log('found option');
        if (arg.flag === true) { // if arg is a switch
          //console.log('option is flag');
          result.addArg = {name: getOptionName(arg.name), positional: false, value: arg.value, required: arg.required, flag: arg.flag};
          //console.log(result);
          continue;
        }
        if (inputList[i + 1] === undefined) { // if theres nothing in front
          //console.log('nothing in front');
          if (arg.value === null) { // if arg has no default
            //console.log('no default value');
            continue;
          } else {
            //console.log('using default value');
            result.addArg = {name: getOptionName(arg.name), positional: false, value: arg.value, required: arg.required, flag: arg.flag};
            //console.log(result);
          }
        } else { // something is in front
          //console.log('something in front');
          if (!this.verifyOption(inputList[i + 1])) { // if something isn't an option
            //console.log('something is not an option');
            result.addArg = {name: getOptionName(arg.name), positional: false, value: inputList[i + 1], required: arg.required, flag: arg.flag};
            //console.log(result);
            continue;
          }
        }
      }
      arg = this.verifyPositional(inputList.indexOf(currentInput));
      if (arg !== false) {
        //console.log('found positional');
        //console.log(currentInput);
        if (!this.verifyOption(currentInput)) {
          if (this.isOptionValue(result, currentInput)) {
            //console.log('positional value is an options value; skipping');
            //console.log(result, currentInput);
            continue;
          }
          //console.log('positional is not an option, nor is its value an options value');
          //console.log(arg);
          result.addArg = {name: arg.name, positional: true, value: currentInput, required: arg.required, flag: arg.flag};
          //console.log(result);
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
    //this.options.forEach(option => {
    //  if (option.flag !== false && result[getOptionName(option.name)] === undefined) {
    //    result[getOptionName(option.name)] = false;
    //  }
    //});
    return result;
  }
}

/*let a = new vargs(
  {
    name: 'huluhoop',
    positional: true
  }, 
  {
    name: 'hoophulu'
  }
);*/
/*let a = new vargs();
a.addArg = {name: 'huluhoop', positional: true, required: false, value: 'yui'};
a.addArg = {name: 'hoophulu', positional: true};
a.addArg = {name: '--verbose', positional: false, required: false, value: 'TRUE'};
a.addArg = {name: ['-c', '--cola'], positional: false, required: false, value: 'coca', flag: false};
a.addArg = {name: ['-b', '--boo'], positional: false, flag: false};
*/
//console.log(Object.keys(a));
/*a.addArg('hoophulu', true);
a.addArg(['-v', '--verbose'], false, 'TRUE', false, true);
a.addArg(['-c', '--cola'], false, 'coca', false, false);
a.addArg(['-b', '--boo'], false, null, true, false);*/
//console.log('raw,', a);

//let j = a.parseArgsMap(process.argv.slice(2));
//console.log('map,', j);

//let k = a.parseArgsObject(process.argv.slice(2));
//console.log('object literal,', k);

//let f = a.parseArgs(process.argv.slice(2));
//console.log('vargs object,', f);

//let b = f.toMap();
//console.log('mappified,', b);

//let c = f.toObject();
//console.log('objectified,', c);

//console.log('pos,', f.positionals);
//console.log('opts,', f.options);
//console.log(f.cola.value, f.huluhoop.value);
