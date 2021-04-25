# cmdparse - Node.js command line argument parser

**cmdparse** is a command line argument parser for Node.js. It supports positional, option and compound arguments, flags, required arguments, multiple option names and values etc. It uses a simple getter and setter based interface. It is inspired by Python's `argparse` module.

## Usage

Start by defining an instance of the `cmdparse` class, then use the `addPositional`, `addOption` or `addCompound` setters to add arguments to your object:

```JavaScript
const cmdparse = require('cmdparse');

let myArgs = new cmdparse('Example', 'A cmdparse example');

myArgs.addPositional = {name: 'drink'};
myArgs.addOption = {name: '--garnish' value: 'lemon', flag: true};
```

Once you've set up your arguments, use the `parseArgs` method to get values from some input. `parseArgs` will return an object where the keys are your arguments' names and the values are the values assigned from parsing the input. If the parse fails for some reason (*e.g.* required arguments were missing), it will return `false`.

An example, assuming you pass `bubbletea --garnish cola` on the command line:

```JavaScript
let userArguments = myArgs.parseArgs(process.argv.slice(2));
console.log(userArguments);

// prints: [Object: null prototype] { drink: 'bubbletea', garnish: 'lemon' }
```

You can also use a Map instead of an object, if you prefer, by using the `parseArgsMap()` method.

```
let userArguments = myArgs.parseArgsMap(process.argv.slice(2));
console.log(userArguments);

// prints: Map(2) { 'drink' => 'bubbletea', 'garnish' => 'lemon' }
```

You can also use compound arguments (commands with subcommands, like `git commit -s` or `apt install some-package`). Compound arguments work just like cmdparse objects, like so:

```JavaScript
myArgs.addCompound = {name: 'add', required: false, help: 'add something'};
myArgs.add.commands.addPositional = {name: 'fruit', help: 'a fruit to add'};

console.log(myArgs);

// Prints:
// cmdparse {
//   __name: 'Example',
//   __description: 'A cmdparse example',
//  
//   // ... shortened for brevity
//
//   add: Compound {
//     name: 'add',
//     commands: cmdparse {
//       __name: 'add',
//       __description: 'add something',
//       fruit: [Positional]
//     },
//     required: false,
//     help: 'add something'
//  }
// }

userArguments = myArgs.parseArgs(['bubbletea', '--garnish', 'cola', 'add', 'pineapple']);
console.log(userArguments);

// Prints:
// [Object: null prototype] {
//   drink: 'bubbletea',
//   garnish: 'lemon',
//   add: [Object: null prototype] { fruit: 'pineapple' }
// }

console.log(userArguments.add.fruit);

// Prints: pineapple


// An example with parseArgsMap()

userArguments = myArgs.parseArgsMap(['bubbletea', '--garnish', 'cola', 'add', 'pineapple']);
console.log(userArguments);

// Prints:
// Map(3) {
//   'drink' => 'bubbletea',
//   'garnish' => 'lemon',
//   'add' => Map(1) { 'fruit' => 'pineapple' }
// }
``` 

## Reference

The cmdparse class has two properties which are always present, `__name` and `__description`. These are used in the `getShortHelp` and `getLongHelp` getters, to show the program's name and description. You can set these on the cmdparse constructor (as shown in the [Usage section](#usage)).

All the arguments you add, through `addPositional`, `addOption` and `addCompound`, are set as properties on the cmdparse instance. You can access them by dot notation (`myArgs.drink`) or bracket notation (`myArgs['drink']`) just like you would with a generic object. You can access properties of the arguments in the same way, like `myArgs.drink.value` or `myArgs.garnish['required']`.

In fact, when you call `parseArgs()` or `parseArgsMap`, you are just creating a new cmdparse instance based off of the one you are calling from, which has been set with new values from the input array; and then converting this to an object or Map for the return value.

If you want to access the cmdparse instance that `parseArgs()`/`parseArgsMap()` are creating, you can just use the `parse()` method on the cmdparse object; this will return the new cmdparse object, with the values from the input you passed.


### Positional arguments

Positional arguments are arguments that determine their value based on their position in the command string. This means that positional arguments also have a `position` property (which is zero-indexed, meaning that the first item has an position of 0) that determines where in the input the argument should appear. cmdparse also supports positional arguments with default values; this means that if a positional argument is not detected, and a `value` has been specified for the argument which is not `null`, a default value will be used in its place.

Positional arguments have the following properties:

- `name` - holds the property name for the argument, only used in your code to refer to the argument.
- `value` - holds the default value for the argument, only used when no value is found when parsing input. Default: `null`.
- `required` - a `true`/`false` value that will cause `parseArgs` and `parseArgsMap` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `true`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`. Default: `''` (empty string).
- `position` - an integer that dictates where in an input array the argument should appear. Default: increments from 0.

An example:

```
myArgs.addPositional = {name: 'drink', value: 'bubbletea', required: true, help: 'a drink', position: 0};
```

### Option arguments

Option arguments are arguments that can determine their value based on values in front of them (*e.g.* `--target foo/`), or by their presence or absence (*e.g.* `--verbose` to change program output, also referred to as *flags*). Their position in the command string is irrelevant, however if they displace a positional argument then the positional argument will be set to its default value or ignored.

Option arguments have the following properties:

- `name` - holds the property name for the argument, also serves as the token(s) to recognize the option in an input array. You can have multiple option names (*e.g.* `['-t', '-tgt', '--target']`); in that case, if any of the names are found in an input string, the option will be recognized; or a single name (*e.g.* `'--verbose'`).
- `value` - holds the default value for the argument (as long as its not `null`), used when no value is found when parsing input; or, if the `flag` property is set to `true`, then this is the value used when the flag is found in an input array. Default: `null`.
- `required` - a `true`/`false` value that will cause `parseArgs` and `parseArgsMap` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `false`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`.
- `flag` - a `true`/`false` value that determines if the argument should be treated as a flag. Default: `false`.
- `nargs` - determines how the option should treat multiple values. It has four possible values:
	+ `false` - the argument will only use one value. The default value.
	+ `'+'` - the argument will consume one or more values, until the end of the input is reached or another option is encountered. If there are no values for the argument to consume, the argument will be omitted from the result of a `parseArgs()`/`parseArgsMap()` (unless `value` has been set, in which case the option will be included with it's default value).
	+ `'*'` - the argument will consume zero or more values, until the end of the input is reached or another option is encountered. The argument will be included in the results of `parseArgs()`/`parseArgsMap()`, even if there are no values to consume. The `value` property will be used as the default value if there are no arguments, otherwise it will be an empty array (`[]`).
	+ `5` etc. - if a number is used, the argument will consume up to that many values until the end of the input or another option is encountered. The default value will be used in the same manner as the `'+'` setting.

An example:

```
myArgs.addOption = {name: '--citrus', value: 'lemon', flag: true, help: 'add lemon juice'};
myArgs.addOption = {name: ['-g', '--garnish'], help: 'an optional garnish'};
myArgs.addOption = {name: '--additions', nargs: '+', help: 'food additives'};
```

### Compound arguments

Compound arguments are arguments which themselves take further arguments (examples of programs using this type of argument are git, `git commit -s`, or npm, `npm run test`). This allows one to construct a more complex CLI interface.

Compound arguments have the following properties:

- `name` - holds the property name for the argument, used in your code to refer to the argument, also serves as the `__name` for the `commands` property's cmdparse object. You can have multiple command names (*e.g.* `['-i', '-in', '--install']`); in that case, if any of the names are found in an input string, the command will be recognized; or a single name (*e.g.* `'install'`).
- `commands` - a cmdparse object that holds the subcommands for the compound argument. This works just like a normal cmdparse instance, with all the same methods. Default: `new cmdparse()`.
- `required` - a `true`/`false` value that will cause `parseArgs` and `parseArgsMap` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `true`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`, also used for the `__description` for the `commands` property's cmdparse object. Default: `''` (empty string).

Make sure that you only try `addPositional` etc. on the `commands` property of the compound argument (*e.g.* `myArgs.make.commands`), because only the `commands` property is actually a cmdparse instance.

An example:

```
myArgs.addCompound = {name: 'install', help: 'install a package'};
myArgs.add.commands.addPositional = {name: 'package', help: 'package to install'};
```

## Report bugs/issues

Please report any bugs or problems using the [Github issue tracker](); include as much detail as you can, such as what you were doing or trying to do.

## License

Copyright 2021 Elizabeth M.
This software is available under the MIT license; see the [license here]().
