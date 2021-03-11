class Arg {
  constructor(name, value, required) {
    this.name = name;
    this.value = value;
    this.required = required;
  }
}

class Positional extends Arg {
  constructor(name, value, required, position) {
    super(name, value, required);
    this.position = position;
  }
}

class Option extends Arg {
  constructor(name, value, required, flag) {
    super(name, value, required);
    this.flag = flag;
  } 
}

module.exports.Positional = Positional;
module.exports.Option = Option;
