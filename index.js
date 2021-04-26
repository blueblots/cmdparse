/* cmdparse - Node.js command line argument parser.
 * 
 * Copyright (c) 2020-2021 Elizabeth M. <blueblots@protonmail.com>
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

const path = require('path');

const {Positional, Option, Compound} = require('./lib/class.js');
const helperlib = require('./lib/helper.js');

class cmdparse {
  constructor(name = `${path.basename(__filename)}`, description = '') {
    this.__name = name;
    this.__description = description;
  }
  
  addPositional({name, value=null, required=true, help='', position=this.positionals.length}) {
    if (name === undefined || name === null) {
      throw 'cmdparse: addPositional: ERROR: name must not be null or undefined';
    }
    let newPositional = new Positional(name, value, required, help, position);
    this[name] = newPositional;
  }
  
  addOption({name, value=null, required=false, help='', flag=false, nargs=false}) {
    if (name === undefined || name === null) {
      throw 'cmdparse: addOption: ERROR: name must not be null or undefined';
    }
    let newOption = new Option(name, value, required, help, flag, nargs);
    this[helperlib.getOptionName(name)] = newOption;
  }

  addCompound({name, commands=new cmdparse(), required=true, help=''}) {
    if (name === undefined || name === null) {
      throw 'cmdparse: addCompound: ERROR: name must not be null or undefined';
    }
    let newCompound = new Compound(name, commands, required, help);
    newCompound.commands.__name = helperlib.getOptionName(name);
    newCompound.commands.__description = help;
    this[helperlib.getOptionName(name)] = newCompound;
  }
  
  delArg(name) {
    delete this[name];
  }

  get compounds() {
    return helperlib.getPropertiesByType(this, Compound);
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
  
  getShortHelp(prefix = '\nUSAGE: ') {
    let result = `${prefix}${this.__name} `;
    this.positionals.forEach(pos => {
      if (pos.required === false) {
        result += `[ ${pos.name} ] `;
      }
      else {
        result += `<${pos.name}> `;
      }
    });
    this.options.forEach(opt => {
      if (opt.required === false) {
        result += `[ ${opt.name} ] `;
      }
      else {
        result += `<${opt.name}> `;
      }
    });
    this.compounds.forEach(com => {
      if (com.required === false) {
        result += `[ ${com.commands.getShortHelp('')} ] `;
      }
      else {
        result += `${com.commands.getShortHelp('')} `;
      }
    });
    return result;
  }
  
  getLongHelp(length=40, prefix='USAGE: ') {
    let result = `\n${this.__name} - ${this.__description}\n${this.getShortHelp(prefix)}\n\n`;
    if (this.positionals.length > 0) {
      result += helperlib.formatHelp(helperlib.extractPropertiesFromObjects(this.positionals, 'name'),
                                     helperlib.extractPropertiesFromObjects(this.positionals, 'help'), ' ', length);
    }
    if (this.options.length > 0) {
      result += '\nOPTIONS:\n';
      result += helperlib.formatHelp(helperlib.extractPropertiesFromObjects(this.options, 'name'),
                                     helperlib.extractPropertiesFromObjects(this.options, 'help'), ' ', length);
    }
    if (this.compounds.length > 0) {
      result += '\nCOMMANDS:\n';
      result += helperlib.formatHelp(helperlib.extractPropertiesFromObjects(this.compounds, 'name'),
                                     helperlib.extractPropertiesFromObjects(this.compounds, 'help'), ' ', length);
    }
    return result;
  }
  
  toObject() {
    let result = Object.create(null);
    this.positionals.forEach(pos => {
      result[helperlib.getOptionName(pos.name)] = pos.value;
    });
    this.options.forEach(opt => {
      result[helperlib.getOptionName(opt.name)] = opt.value;
    });
    this.compounds.forEach(com => {
      result[helperlib.getOptionName(com.name)] = com.commands.toObject();  
    });
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
    this.compounds.forEach(com => {
      result.set(helperlib.getOptionName(com.name), com.commands.toMap());  
    });
    return result;
  }
  
  parsePositional(currentInput, positional, result) {
    /* Parse a positional argument, return the argument if its actually a positional, otherwise false. */
    if (this.verifyOption(currentInput) === false) {
      if (this.isOptionValue(result, currentInput)) {
        return false;
      }
      return {name: positional.name, value: currentInput, required: positional.required, position: positional.position};
    }
    else {
      return false;
    }
    throw 'ERROR: Positional parse failed';
  }
  
  parseOption(currentInput, inputList, count) {
    /* Parse currentInput, return an option if input is an option, otherwise false. */
    if (currentInput.flag === true) {
      /* if arg is a flag */
      return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag};
    }
    if (inputList[count + 1] === undefined) {
      /* if there's nothing in front of the arg */
      if (currentInput.value === null) {
        /* if arg has no default */
        return false;
      }
      else {
        /* use the default value */
        return {name: currentInput.name, value: currentInput.value, required: currentInput.required, flag: currentInput.flag, nargs: currentInput.nargs};
      }
    }
    else {
      /* something is in front of the arg */
      if (this.verifyOption(inputList[count + 1]) === false) {
        let argValue;
        if (currentInput.nargs !== false) {
          /* process multiple values */
          argValue = [];
          let remainingInput = inputList.slice(count + 1);
          if (currentInput.nargs === '+') {
            /* one or more values are accepted */
            for (let i = 0; i < remainingInput.length; i++) {
              if (this.verifyOption(remainingInput[i]) === false) {
                argValue.push(remainingInput[i]);
              }
              else {
                break;
              }
            }
            if (argValue.length === 0) {
              return false;
            }
          }
          else if (currentInput.nargs === '*') {
            /* zero or more values are accepted */
            for (let i = 0; i < remainingInput.length; i++) {
              if (this.verifyOption(remainingInput[i]) === false) {
                argValue.push(remainingInput[i]);
              }
              else {
                break;
              }
            }
          }
          else if (Number.isInteger(parseInt(currentInput.nargs)) !== false) {
            /* a certain number of values is accepted */
            for (let i = 0; i < parseInt(currentInput.nargs); i++) {
              if (this.verifyOption(remainingInput[i]) === false) {
                argValue.push(remainingInput[i]);
              }
              else {
                break;
              }
            }
          }
        }
        else {
          /* if something in front of the arg isn't an option */
          argValue = inputList[count + 1];
        }
        return {name: currentInput.name, value: argValue, required: currentInput.required, flag: currentInput.flag, nargs: currentInput.nargs};
      }
      else {
        /* the thing in front is an option */
        return false;
      }
    }
    throw 'ERROR: Option parse failed';
  }
  
  parse(inputList) {
    /* Parse a command string (must be an array), return a cmdparse object with values matching the command string. */
    let arg;
    let currentInput;
    let detectedPositional;
    let detectedOption;
    let detectedCompound;
    let result = new cmdparse();
    for (let i = 0; i < inputList.length; i++) {
      currentInput = inputList[i];
      /* Handle options */
      arg = this.verifyOption(currentInput);
      if (arg !== false) {
        detectedOption = this.parseOption(arg, inputList, i);
        if (detectedOption !== false) {
          result.addOption(detectedOption);
        } else {
          continue;
        }
      }
      /* Handle positionals */
      arg = this.verifyPositional(inputList.indexOf(currentInput));
      if (arg !== false) {
        detectedPositional = this.parsePositional(currentInput, arg, result);
        if (detectedPositional !== false) {
          result.addPositional(detectedPositional);
        } else {
          continue;
        }
      }
      /* Handle compound arguments */
      arg = this.verifyCompound(currentInput);
      if (arg !== false) {
        detectedCompound = arg.commands.parse(inputList.slice(i + 1));
        if (detectedCompound !== false) {
          result.addCompound({name: arg.name, required: arg.required, commands: detectedCompound, help: arg.help});
        }
        else {
          continue;
        }
      }
    }
    /* Check that all required arguments are included */
    if (this.verifyRequired(result) === false) {
      return false;
    }
    /* Set any default values */
    this.setDefaultValues(result);
    return result;
  }
  
  parseArgs(input) {
    /* Shortcut for parse.toObject */
    let result = this.parse(input);
    if (result !== false) {
      return result.toObject();
    }
    else {
      return false;
    }
  }
  
  parseArgsMap(input) {
    /* Shortcut for parse.toMap */
    let result = this.parse(input);
    if (result !== false) {
      return result.toMap();
    }
    else {
      return false;
    }
  }
  
  verifyCompound(input) {
    /* Return compound argument if input matches a compound name, otherwise false. */
    for (let i = 0; i < this.compounds.length; i++) {
      if (this.compounds[i].name instanceof Array) {
        if (this.compounds[i].name.includes(input)) {
          return this.compounds[i];
        }
      } else if (this.compounds[i].name === input) {
        return this.compounds[i];
      }
    }
    return false;
  }
  
  verifyOption(input) {
     /* Return option argument if input matches an option name, otherwise false. */
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
     /* Return positional argument if inputPosition matches a positional's position, otherwise false. */
    for (let i = 0; i < this.positionals.length; i++) {
      if (this.positionals[i].position === inputPosition) {
        return this.positionals[i];
      }
    }
    return false;
  }
  
  verifyRequired(input) {
    /* Check that required arguments are available. */
    let count = 0;
    for (let i = 0; i < this.required.length; i++) {
      /* If the new cmdparse has a property with the same name
       * as one in this.required, increase the count of required arguments. */
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
    /* Set any default values that are needed in input cmdparse. */
    /* Check positional defaults. */
    for (let i = 0; i < this.positionals.length; i++) {
      if (this.positionals[i].value !== null) {
        if (input.positionals.includes(this.positionals[i]) === false) {
          input.addPositional({...this.positionals[i]});
        }
      }
      else {
        continue;
      }
    }
    /* Check option defaults. */
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].value !== null && this.options[i].flag === false) {
        if (input[helperlib.getOptionName(this.options[i].name)] === undefined) {
          input.addOption({...this.options[i]});
        }
      }
      else {
        continue;
      }
    }
  }
  
  isOptionValue(input, value) {
    /* Check that a positional argument's value is not identical to an option's value. */
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

module.exports = cmdparse;
