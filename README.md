# vargs - JavaScript command line argument parser

## Description

**vargs** is a minimalist command line argument parser. It supports positional and option arguments, flags, required arguments, multiple option names, and more. It offers a simple getter and setter based interface. It only focuses on processing arguments, leaving where you get your inputs from up to you.

## Usage

Start by defining an instance of the `vargs` object; (make sure to `require` it first); then you can either add your arguments right away on the constructor or use the `addArg` setter to add arguments to your object:

```JavaScript
const vargs = require('vargs');

// using the constructor

let myArgs = new vargs(
	{
		name: 'drink',
		value: 'bubbletea'
	},
	{
		name: '--garnish',
		positional: false,
		value: 'lemon',
		required: false
	}
);

// using the addArg setter

let myArgs = new vargs();

myArgs.addArg = {name: 'drink', value: 'bubbletea'};
myArgs.addArg = {name: '--garnish', positional: false, value: 'lemon', required: false};

```

Both of the above methods will produce the same result.

Once you've set up your options, use the `parseArgs` method to detect input. `parseArgs` will create a new `vargs` instance based off of your accepted arguments and the input you pass to it. Then you can use the `vargs` object directly or transform it into a `Map` or object literal.

Example (using constructor):
```JavaScript
let userArguments = myArgs.parseArgs(process.argv.slice(2));

// using the vargs object

console.log(userArguments.drink.value);
// prints 'bubbletea'; or whatever value is first passed in input

console.log(userArguments.garnish.value);
// prints 'lemon'; or if '--garnish' is not given, prints undefined

// using a map - results are the same as vargs example

let argMap = userArguments.toMap();

console.log(argMap.get(drink));
console.log(argMap.get(garnish)); 

// using an object literal - results are the same as vargs example

let argMap = userArguments.toObject();

console.log(argMap.drink);
console.log(argMap.garnish);
```


## API Reference

### Constructor

### Getters

### Setters

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