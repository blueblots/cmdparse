# cmdparse - Node.js command line argument parser

**cmdparse** is a command line argument parser for Node.js. It supports positional, optional and compound arguments (subcommands), flags, required arguments, multiple option names and values etc. It is inspired by Python's `argparse` module. It also has no external dependencies.

## Usage

```JavaScript
/* Require and instantiate cmdparse. */

const cmdparse = require('./index.js');
let args = new cmdparse('exampleName', 'A cmdparse example description');

/* You can add positional arguments, options or compound arguments
 * (arguments that take arguments, like git commit or npm run test). */

args.addPositional({name: 'file', help: 'an input file'});
args.addPositional({name: 'bogus', help: 'delete me'});
args.addOption({name: ['-o', '--output'], help: 'an output file'});
args.addCompound({name: 'help', required: false, help: 'get help about an argument'});
args.help.commands.addPositional({name: 'argument', help: 'argument to see help about'});
console.log(args);
// cmdparse {
//   __name: 'example name',
//   __description: 'A cmdparse example description',
//   file: Positional {
//     name: 'file',
//     value: null,
//     required: true,
//     help: 'an input file',
//     position: 0
//   },
//   bogus: Positional {
//     name: 'bogus',
//     value: null,
//     required: true,
//     help: 'delete me',
//     position: 1
//   },
//   output: Option {
//     name: [ '-o', '--output' ],
//     value: null,
//     required: false,
//     help: 'an output file',
//     flag: false,
//     nargs: false
//   },
//   help: Compound {
//     name: 'help',
//     commands: cmdparse {
//       __name: 'help',
//       __description: 'get help about an argument',
//       argument: [Positional]
//     },
//     required: false,
//     help: 'get help about an argument'
//   }
// }

/* You can also delete arguments by passing their names to the delArg() method. */

args.delArg('bogus');
console.log(args);
// cmdparse {
//   __name: 'example name',
//   __description: 'A cmdparse example description',
//   file: Positional {
//     name: 'file',
//     value: null,
//     required: true,
//     help: 'an input file',
//     position: 0
//   },
//   output: Option {
//     name: [ '-o', '--output' ],
//     value: null,
//     required: false,
//     help: 'an output file',
//     flag: false,
//     nargs: false
//   },
//   help: Compound {
//     name: 'help',
//     commands: cmdparse {
//       __name: 'help',
//       __description: 'get help about an argument',
//       argument: [Positional]
//     },
//     required: false,
//     help: 'get help about an argument'
//   }
// }


/*********************************************************************/


/* Print help messages. */

console.log(args.getShortHelp());
// USAGE: example name <file> [ -o,--output ] [ help <argument>  ] 

console.log(args.getLongHelp());
// exampleName - A cmdparse example description
// USAGE: exampleName <file> [ -o,--output ] [ help <argument>  ] 
// 
// file                       an input file
// 
// OPTIONS:
// -o,--output               an output file
// 
// COMMANDS:
// help          get help about an argument

console.log(args.help.commands.getLongHelp(40, 'USAGE: exampleName '));
// help - get help about an argument
// USAGE: help <argument> 
// 
// argument      argument to see help about

/* You can change the spacing between the argument names and descriptions
 * by passing a number to getLongHelp(). The parameter will determine the
 * width of the help output (the default is 40). The 'USAGE: ' prefix can
 * also be changed, by passing a different string after the width parameter.
 * 
 * You can also change the prefix of getShortHelp() (e.g. 'USAGE: ', the
 * default). Just pass in the string that you'd prefer. */

/*********************************************************************/


/* Do parseArgs(input) or parseArgsMap(input) to parse input (returning
 * an object or Map respectively). */

let objResult = args.parseArgs(process.argv.slice(2));
let mapResult = args.parseArgsMap(process.argv.slice(2));

/* Assuming process.env.argv.slice(2) is ['foo.txt', '-o', 'bar.txt']: */

console.log(objResult);
// [Object: null prototype] { file: 'foo.txt', output: 'bar.txt' }

console.log(mapResult);
// Map(2) { 'file' => 'foo.txt', 'output' => 'bar.txt' }

/* An example using the compound argument 'help': */

let compoundResult = args.parseArgs(['foo.txt', 'help', 'file']);

console.log(compoundResult);
// [Object: null prototype] {
//   file: 'foo.txt',
//   help: [Object: null prototype] { argument: 'file' }
// }

/* As can be seen above, compound arguments are converted to an object 
 * stored under the name of the compound argument ('help'). If you use
 * parseArgsMap the compound argument is converted to a Map instead. */


/*********************************************************************/


/* Let's say you wanted to take several input files.
 * You can use a multiple value option. */

args.addOption({name: ['-i', '--inputs'], nargs: '+', help: 'some input files'});

/* nargs can have four values: '+' (one or more), '*' (zero or more),
 * '5' etc. (up to 5 and so on), and false (only take one argument). */

let nargsResult = args.parseArgs(['foo.txt', '-i', 'foobar.txt', 'bar.txt']);

console.log(nargsResult);
// [Object: null prototype] {
//   file: 'foo.txt',
//   inputs: [ 'foobar.txt', 'bar.txt' ]
// }

/* Multiple value options always return an array as their value. */


/*********************************************************************/


/* If you leave out a required argument (in this case, the 'file' positional),
 * parseArgs() and parseArgsMap() will return false. */

let falseResult = args.parseArgs(['-i', 'foobar.txt', 'bar.txt']);
console.log(falseResult);
// false!

/* Positional and compound arguments are required by default, options are not.
 * You can set this by using a 'required' property of true or false in addPositional(),
 * addOption(), or addCompound(). */


/*********************************************************************/


/* You can also use options as flags (also known as switches), an example below: */

args.addOption({name: '--verbose', flag: true, value: true, help: 'show more output'});
console.log(args.parseArgs(['foo.txt', '-i', 'foobar.txt', 'bar.txt', '--verbose']));
// [Object: null prototype] {
//   file: 'foo.txt',
//   inputs: [ 'foobar.txt', 'bar.txt' ],
//   verbose: true
// }


/* If a flag is not found in the input you pass to parseArgs(), then it is omitted from
 * the returned object or Map. */


/*********************************************************************/


/* Arguments can also have default values, which will be used whenever the argument isn't
 * present in the input. */

args.addPositional({name: 'defaultFile', required: false, value: 'Foobar', help: 'a default value'});
console.log(args.parseArgs(['foo.txt']));
// [Object: null prototype] { file: 'foo.txt', defaultFile: 'Foobar' }


/*********************************************************************/

/* For further information, see the Reference. */
```

## Reference

The cmdparse class has two properties which are always present, `__name` and `__description`. These are used in the `getShortHelp()` and `getLongHelp()` methods, to show the program's name and description. You can set these on the cmdparse constructor (as shown in the [Usage section](#usage)).

All the arguments you add, through `addPositional()`, `addOption()` and `addCompound()`, are set as properties on the cmdparse instance. You can access them by dot notation (`myArgs.drink`) or bracket notation (`myArgs['drink']`) just like you would with a generic object. You can access properties of the arguments in the same way, like `myArgs.drink.value` or `myArgs.garnish['required']`.

In fact, when you call `parseArgs()` or `parseArgsMap()`, you are just creating a new cmdparse instance based off of the one you are calling from, which has been set with new values from the input array; and then converting it to an object or Map for the return value.

If you want to access the cmdparse instance that `parseArgs()`/`parseArgsMap()` methods create, you can just use the `parse()` method on the cmdparse object; this will return the new cmdparse object, with the values from the input you passed.


### Positional arguments

Positional arguments are arguments that determine their value based on their position in the input array. This means that positional arguments also have a `position` property (which is zero-indexed, meaning that the first item has an `position` of 0) that determines where in the input the argument should appear. cmdparse also supports positional arguments with default values; this means that if a positional argument is not detected, and a `value` has been specified for the argument which is not `null`, a default value will be used in its place.

Positional arguments have the following properties:

- `name` - holds the property name for the argument, only used in your code to refer to the argument.
- `value` - holds the default value for the argument, only used when no value is found when parsing input. Default: `null`.
- `required` - a `true`/`false` value that will cause `parseArgs()` and `parseArgsMap()` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `true`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`. Default: `''` (empty string).
- `position` - an integer that dictates where in an input array the argument should appear. Default: increments from 0.

An example:

```
myArgs.addPositional({name: 'drink', value: 'bubbletea', required: true, help: 'a drink', position: 0});
```

### Optional arguments

Optional arguments are arguments that can determine their value based on values in front of them (*e.g.* `--target foo/`), or by their presence or absence (*e.g.* `--verbose` to change program output, also referred to as *flags*). Their position in the command string is irrelevant, however if they displace a positional argument then the positional argument will be set to its default value or ignored.

Optional arguments have the following properties:

- `name` - holds the property name for the argument, also serves as the token(s) to recognize the option in an input array. You can have multiple option names (*e.g.* `['-t', '-tgt', '--target']`); in that case, if any of the names are found in an input string, the option will be recognized; or a single name (*e.g.* `'--verbose'`).
- `value` - holds the default value for the argument (as long as its not `null`), used when no value is found when parsing input; or, if the `flag` property is set to `true`, then this is the value used when the flag is found in an input array. Default: `null`.
- `required` - a `true`/`false` value that will cause `parseArgs()` and `parseArgsMap()` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `false`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`.
- `flag` - a `true`/`false` value that determines if the argument should be treated as a flag. Default: `false`.
- `nargs` - determines how the option should treat multiple values. It has four possible values:
	+ `false` - the argument will only use one value. The default value.
	+ `'+'` - the argument will consume one or more values, until the end of the input is reached or another option is encountered. If there are no values for the argument to consume, the argument will be omitted from the result of a `parseArgs()`/`parseArgsMap()` (unless `value` has been set, in which case the option will be included with it's default value).
	+ `'*'` - the argument will consume zero or more values, until the end of the input is reached or another option is encountered. The argument will be included in the results of `parseArgs()`/`parseArgsMap()`, even if there are no values to consume. The `value` property will be used as the default value if there are no arguments, otherwise it will be an empty array (`[]`).
	+ `5` etc. - if a number is used, the argument will consume up to that many values until the end of the input or another option is encountered. The default value will be used in the same manner as the `'+'` setting.

An example:

```
myArgs.addOption({name: '--citrus', value: 'lemon', flag: true, help: 'add lemon juice'});
myArgs.addOption({name: ['-g', '--garnish'], help: 'an optional garnish'});
myArgs.addOption({name: '--additions', nargs: '+', help: 'food additives'});
```

### Compound arguments

Compound arguments are arguments which themselves take further arguments (examples of programs using this type of argument are git, `git commit -s`, or npm, `npm run test`). This allows one to construct a more complex CLI interface.

Compound arguments have the following properties:

- `name` - holds the property name for the argument, used in your code to refer to the argument, also serves as the `__name` for the `commands` property's cmdparse object. You can have multiple command names (*e.g.* `['i', 'in', 'install']`); in that case, if any of the names are found in an input string, the command will be recognized; or a single name (*e.g.* `'install'`).
- `commands` - a cmdparse object that holds the subcommands for the compound argument. This works just like a normal cmdparse instance, with all the same methods. Default: `new cmdparse()`.
- `required` - a `true`/`false` value that will cause `parseArgs()` and `parseArgsMap()` to fail (*i.e* return `false`) if the argument is not detected in the input. Default: `true`.
- `help` - a string which is shown as the argument's help description in `cmdparse.getLongHelp`, also used for the `__description` for the `commands` property's cmdparse object. Default: `''` (empty string).

Make sure that you only try `addPositional()` etc. on the `commands` property of the compound argument (*e.g.* `myArgs.make.commands`), because only the `commands` property is actually a cmdparse instance.

An example:

```
myArgs.addCompound({name: 'install', help: 'install a package'});
myArgs.install.commands.addPositional({name: 'package', help: 'package to install'});
```

## Report bugs/issues

Please report any bugs or problems using the [Github issue tracker](https://github.com/blueblots/cmdparse/issues); include as much detail as you can, such as what you were doing or trying to do.

## License

Copyright 2020-2021 Elizabeth M.

This program is available under the MIT license; see the [license here](https://github.com/blueblots/cmdparse/blob/master/LICENSE).
