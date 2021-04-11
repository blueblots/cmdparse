// vargs - minimal JavaScript argument parser.
const path = require('path');

const {Positional, Option} = require('./lib/class.js');
const helperlib = require('./lib/helper.js');

class vargs {
  constructor(name = `${path.basename(__filename)}`, description = '') {
    this.__name = name;
    this.__description = description;
  }
  
  set addPositional({name, value=null, required=true, help='', position=this.positionals.length}) {
    let newPositional = new Positional(name, value, required, help, position);
    this[name] = newPositional;
  }
  
  set addOption({name, value=null, required=false, help='', flag=false}) {
    let newOption = new Option(name, value, required, help, flag);
    this[helperlib.getOptionName(name)] = newOption;
  }
  
  // TODO
  set addCompound({name, required=true, commands=new vargs()}) {
    console.log('TODO: unimplemented');
  }
  
  set delArg(name) {
    delete this[name];
  }

  get compounds() {
    console.log('TODO: unimplemented');
  }
  
  get positionals() {
    return helperlib.getPropertiesByType(this, Positional);
  }
  
  get options() {
    return helperlib.getPropertiesByType(this, Option);
  }
  
  get required() {
    return helperlib.getPropertiesByProperty(this, 'required');
  }
  
  get flags() {
    return helperlib.getPropertiesByProperty(this, 'flag');
  }
  
  get getShortHelp() {
    let result = `\nUSAGE: ${this.__name} `;
    this.positionals.forEach(pos => {
      if (pos.required === false) {
        result += `[ ${pos.name} ] `
      }
      else {
        result += `${pos.name} `;
      }
    });
    this.options.forEach(opt => {
      if (opt.required === false) {
        result += `[ ${opt.name} ] `
      }
      else {
        result += `${opt.name} `;
      }
    });
    return result;
  }
  
  get getLongHelp() {
    let result = `\n${this.__name} - ${this.__description}\n${this.getShortHelp}\n\n`;
    this.positionals.forEach(pos => {
      result += pos.help.toString() + '\n';
    });
    if (this.options.length > 0) {
      result += '\nOPTIONS:\n';
      this.options.forEach(opt => {
        result += opt.help.toString() + '\n';
      });
    }
    return result;
  }
  
  toObject() {
    let result = {};
    this.positionals.forEach(pos => {
      result[helperlib.getOptionName(pos.name)] = pos.value;
    });
    this.options.forEach(opt => {
      result[helperlib.getOptionName(opt.name)] = opt.value;
    });
    // TODO compounds
    return result;
  }
  
  toMap() {
    let result = new Map();
    this.positionals.forEach(pos => {
      result.set(helperlib.getOptionName(pos.name), pos.value);
    });
    this.options.forEach(opt => {
      result.set(helperlib.getOptionName(opt.name), opt.value);
    });
    // TODO compounds
    return result;
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
  
  parseOption(currentInput, inputList, count) {
    //console.log('found option');
    if (currentInput.flag === true) {
      // if arg is a switch
      //console.log('option is flag');
      return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag};
    }
    if (inputList[count + 1] === undefined) {
      // if theres nothing in front
      //console.log('nothing in front');
      if (currentInput.value === null) {
        // if arg has no default
        //console.log('no default value');
        return false;
      } else {
        //console.log('using default value');
        return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag};
      }
    } else {
      // something is in front
      //console.log('something in front');
      if (!this.verifyOption(inputList[count + 1])) {
        // if something isn't an option
        //console.log('something is not an option');
        return {name: currentInput.name, value: inputList[count + 1], required: currentInput.required, flag: currentInput.flag};
      } else {
        return false;
      }
    }
    throw Error;
  }
  
  parseCompound() {
    console.log('TODO: unimplemented');
  };
  
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
    this.setDefaultValues(result);
    return result;
  }
  
  verifyOption(input) {
    for (let i = 0; i < this.options.length; i++) {
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
    for (let i = 0; i < this.positionals.length; i++) {
      if (this.positionals[i].position === inputPosition) {
        return this.positionals[i];
      }
    }
    return false;
  }
  
  verifyRequired(input) {
    // check required arguments are available
    let count = 0;
    for (let i = 0; i < this.required.length; i++) {
      if (Object.keys(input).includes(this.required[i].name) || Object.keys(input).includes(helperlib.getOptionName(this.required[i].name))) {
        count += 1;
      }
    }
    if (count !== this.required.length) {
      return false;
    } else {
      return true;
    }
  }
  
  setDefaultValues(input) {
    // Set any default values that are needed in input vargs
    // Check positional defaults
    for (let i = 0; i < this.positionals.length; i++) {
      if (this.positionals[i].value !== null) {
        if (input.positionals.includes(this.positionals[i]) === false) {
          //console.log('found missing positional', this.positionals[i]);
          input.addPositional = {...this.positionals[i]};
        }
      }
      else {
        continue;
      }
    }
    // Check option defaults
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].value !== null && this.options[i].flag === false) {
        if (input.options.includes(this.options[i]) === false) {
          //console.log('found missing option', this.options[i]);
          input.addOption = {...this.options[i]};
        }
      }
      else {
        continue
      }
    }
  }
  
  isOptionValue(input, value) {
    // check that a positional argument's value is not identical to an option's value
    let optionName;
    for (let i = 0; i < this.options.length; i++) {
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
