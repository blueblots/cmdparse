# vargs - JavaScript command line argument parser

## Synopsis

## Description

**vargs** is a minimal command line argument parser. It supports positional and option arguments, switches, required arguments, long and short options, and more.

## Usage

Start by defining an instance of the `vargs` object; (make sure to `require` it first). Then use the `addArg` method to add arguments to your object.

Example:

```JavaScript
const vargs = require('vargs');

// start by defining your accepted arguments

let myArgs = new vargs();

myArgs.addArg('aPositionalArgument'); //

```

## API

An instance of`vargs` centers around it's `argList` property; this is where all the arguments that are added via `addArg` are located.

### Methods

###### vargs.prototype.addArg(name, positional=true, value=null, required=true, flag=true)
Add an argument to the calling `vargs` object.

- `name` 
	+ Value that will be used as the argument's name when parsed.
- `positional`
	+ Boolean value that determines if argument is positional or not. <br> Defaults to `true`. If set to `false` then the argument will be treated as an option.
- `value`
	+ Sets default value of the argument. Defaults to `null`.
- `required`
	+ Boolean value that determines if the argument is required. Defaults to `true`; set to `false` if you are OK with the option being omitted. If the argument is not found when parsing then `parseArg` will return false.
- `flag`
	+ Boolean that determines if the argument is treated as a flag. It only applies if the argument is an option (e.g. if `positional` is set to `false`).

###### vargs.prototype.delArg(name)
	
###### vargs.prototype.parseArgs(inputList)

## Credits