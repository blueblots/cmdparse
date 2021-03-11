// vargs - minimal JavaScript argument parser.

/* first get the args you want to accept and add them to an vargs object.
   when ready use parseArgs with an appropriate argument to interpret a list as arguments.
*/

const {Positional, Option} = require('./lib/class.js');
const helperlib = require('./lib/helper.js');

class vargs {
  constructor(help = '') {
    this.help = help;
  }
  
  // TODO
  
  set addPositional({name, value=null, required=true, position=this.posCount}) {
    let newPositional = new Positional(name, value, required, position);
    //newPositional.name = name;
    //newPositional.value = value;
    //newPositional.required = required;
    //newPositional.position = position;
    //if (name instanceof Array) {
    //  this[helperlib.getOptionName(name)] = newPositional;
    //} else {
    this[name] = newPositional;
    //}
  }
  
  parsePositional(currentInput, positional, result) {
    //console.log('found positional');
    //console.log(currentInput, positional, result);
    if (!this.verifyOption(currentInput)) {
      if (this.isOptionValue(result, currentInput)) {
        //console.log('positional value is an options value; skipping');
        //console.log(result, currentInput);
        return false;
      }
      //console.log('positional is not an option, nor is its value an options value');
      //console.log(positional);
      return {name: positional.name, value: currentInput, required: positional.required, position: positional.position};
    } else {
      return false;
    }
    throw Error;
  }
  
  set addOption({name, value=null, required=false, flag=false}) {
    let newOption = new Option(name, value, required, flag);
    //let newOption = Object.create(null);
    //newOption.name = name;
    //newOption.value = value;
    //newOption.required = required;
    //newOption.flag = flag;
    //console.log('adding option', newOption);
    this[helperlib.getOptionName(name)] = newOption;
  }
  
  parseOption(currentInput, inputList, count) {
    //console.log('found option');
    if (currentInput.flag === true) { // if arg is a switch
      //console.log('option is flag');
      return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag};
    }
    if (inputList[count + 1] === undefined) { // if theres nothing in front
      //console.log('nothing in front');
      if (currentInput.value === null) { // if arg has no default
        //console.log('no default value');
        return false;
      } else {
        //console.log('using default value');
        return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag};
      }
    } else { // something is in front
      //console.log('something in front');
      if (!this.verifyOption(inputList[count + 1])) { // if something isn't an option
        //console.log('something is not an option');
        return {name: currentInput.name, value: inputList[count + 1], required: currentInput.required, flag: currentInput.flag};
      } else {
        return false;
      }
    }
    throw Error;
  }
  
  parse(inputList) {
    //console.log('start parse');
    let arg;
    let currentInput;
    let detectedPositional;
    let detectedOption;
    let result = new vargs();
    for (let i = 0; i < inputList.length; i++) {
      //console.log('looping');
      currentInput = inputList[i];
      arg = this.verifyOption(currentInput);
      //console.log(currentInput, arg);
      if (arg !== false) {
        //console.log('opt: ', arg);
        detectedOption = this.parseOption(arg, inputList, i);
        //console.log('detopt: ', detectedOption);
        if (detectedOption !== false) {
          result.addOption = detectedOption;
        } else {
          continue;
        }
      }
      arg = this.verifyPositional(inputList.indexOf(currentInput));
      if (arg !== false) {
        //console.log('pos: ', arg);
        detectedPositional = this.parsePositional(currentInput, arg, result);
        //console.log('detpos: ', detectedPositional);
        if (detectedPositional !== false) {
          result.addPositional = detectedPositional;
        } else {
          continue;
        }
      }
    }
    //console.log('nono', arg);
    //console.log('checking requireds');
    if (this.verifyRequired(result) === false) {
      return false;
    }
    return result;
  }
  
  
  // TODO
  set addCompound({name, required=true, commands=new vargs()}) {
    let newCompoundArg = Object.create(null);
    newCompoundArg.name = name;
    newCompoundArg.required = required;
    newCompoundArg.commands = commands;
    this[name] = newCompoundArg;
  }
  
  get compounds() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop].commands !== undefined) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get comCount() {
    return this.compounds.length;
  }
  
  parseCompound() {};
  
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
      if (this[prop] instanceof Positional) {
        result.push(this[prop]);
      }
    });
    return result;
  }
  
  get options() {
    let result = [];
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (this[prop] instanceof Option) {
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

  // unused
  //get values() {
  //  let result = [];
  //  Object.getOwnPropertyNames(this).forEach(prop => {
  //    if (this[prop].value !== null) {
  //      result.push(this[prop].value);
  //    }
  //  });
  //  return result;
  //}

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
  
  verifyRequired(input) {
    // check required arguments are available
    let count = 0;
    for (let i = 0; i < this.reqCount; i++) {
      if (Object.keys(input).includes(this.required[i].name) || Object.keys(input).includes(helperlib.getOptionName(this.required[i].name))) {
        count += 1;
      }
    }
    if (count !== this.reqCount) {
      return false;
    } else {
      return true;
    }
  }
  
  isOptionValue(input, value) {
    // check that a positional argument's value is not identical to an option's value
    let optionName;
    for (let i = 0; i < this.optCount; i++) {
      optionName = helperlib.getOptionName(this.options[i].name);
      if (Object.keys(input).includes(optionName)) {
        if (input[optionName].value === value) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = vargs;
