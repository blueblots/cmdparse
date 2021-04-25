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

class Arg {
  constructor(name, value, required, help) {
    this.name = name;
    this.value = value;
    this.required = required;
    if (value !== null) {
      this.help=`${name} (default: ${value})\t${help}`;
    }
    else {
      this.help = `${name}\t${help}`;
    }
  }
}

class Positional extends Arg {
  constructor(name, value, required, help, position) {
    super(name, value, required, help);
    this.position = position;
  }
}

class Option extends Arg {
  constructor(name, value, required, help, flag, nargs) {
    super(name, value, required, help);
    this.flag = flag;
    this.nargs = nargs;
  } 
}

class Compound {
  constructor(name, commands, required, help) {
    this.name = name;
    this.commands = commands;
    this.required = required;
    this.help = help;
  }
}

module.exports.Positional = Positional;
module.exports.Option = Option;
module.exports.Compound = Compound;
