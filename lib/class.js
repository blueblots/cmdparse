class Arg {
  constructor(name, value, required, help) {
    this.name = name;
    this.value = value;
    this.required = required;
    if (value !== null) {
      this.help=`${name} (default: ${value})\t${help}` // TODO
    }
    else {
      this.help = `${name}\t${help}`; // TODO
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
  constructor(name, value, required, help, flag) {
    super(name, value, required, help);
    this.flag = flag;
  } 
}

module.exports.Positional = Positional;
module.exports.Option = Option;
