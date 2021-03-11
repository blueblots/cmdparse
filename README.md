# vargs - JavaScript command line argument parser

## Description

**vargs** is a command line argument parser. It supports positional and option arguments, flags, required arguments, multiple option names, and more. It uses a simple getter and setter based interface. It is inspired by Python's `argparse` module.

## Getting started

Start by defining an instance of the `vargs` object; then you can either add your arguments right away on the constructor or use the `addPositional`, `addOption` or `addCompound` setters to add arguments to your object:

```JavaScript
const vargs = require('vargs');

// using the constructor

let myArgs = new vargs(
	{
        type: 'positional',
		name: 'drink',
		value: 'bubbletea'
	},
	{
        type: 'option',
		name: '--garnish',
		value: 'lemon',
		flag: true
	}
);

// using the addArg setter

let myArgs = new vargs();

myArgs.addPositional = {name: 'drink'};
myArgs.addOption = {name: '--garnish' value: 'lemon', flag: true};

```

Both of the above methods will produce the same result.

Once you've set up your options, use the `parse` method to detect input. `parse` will create a new `vargs` instance based off of your accepted arguments and the input you pass to it. Then you can use the `vargs` object directly or transform it into a `Map` or object literal.

Example (using constructor):
```JavaScript
let userArguments = myArgs.parse(process.argv.slice(2));

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


## Reference manual

All the argument types share the following properties:

- name - holds the property name/option name for the argument, used in your code to refer to it (for options, this is also the token denoting the option).
- value - holds the value retrieved from a command string after doing `vargs.parse`, also holds the default value if one is provided.
- required - a `true`/`false` value which determines if the argument must be provided.

### Positional arguments

Positional arguments are arguments that determine their value based on their position in the command string. This means that positional arguments also have a `position` property (which is zero-indexed, meaning that the first item has an index of 0) that determines where in the input the argument should appear. vargs also supports positional arguments with default values; this means that if a positional argument is not detected, a default value will be used in its place.

An example:

```

```

### Option arguments

Option arguments are arguments that can determine their value based on values in front of them (*e.g.* `--target foo/`), or by their presence or absence (*e.g.* `--verbose` to change program output, also referred to as *flags*). Their position in the command string is irrelevant, however if they displace a positional argument then the positional argument will be set to its default value or ignored.

An example:

```

```

### Compound arguments

Compound arguments are arguments which themselves take further arguments (examples of programs using this type of argument are git, `git commit -s`, or npm, `npm run test`). This allows one to construct a more complex CLI interface.

An example:

```
```

## Credits
