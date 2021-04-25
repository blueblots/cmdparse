const cmdparse = require('../index.js');
const {Positional, Option, Compound} = require('../lib/class.js');

describe('Parser', function() {
  let args;
  let argString = ['bubbletea', 'lemon', 'tea', '-l', '-bg', '--additions', 'pineapple', '--flavor'];
  let compoundString = ['lemon', 'make', 'bubbles', '-l', '--max'];
  let result;
  
  beforeEach(function() {
    result = null;
    args = new cmdparse();
  });
  
  it('can parse positional arguments', function() {
    args.addPositional({name: 'drink'});
    args.addPositional({name: 'garnish', required: false});
    result = args.parse(argString);
    // check if parse succeeded
    expect(result).toBeInstanceOf(cmdparse);
    // check if arguments are defined and instantiatiated
    expect(result.drink).toBeDefined();
    expect(result.garnish).toBeDefined();
    expect(result.drink).toBeInstanceOf(Positional);
    expect(result.garnish).toBeInstanceOf(Positional);
    // check if arguments' properties are correct
    expect(result.drink.name).toEqual('drink');
    expect(result.drink.value).toEqual('bubbletea');
    expect(result.drink.required).toEqual(true);
    expect(result.drink.position).toEqual(0);
    expect(result.garnish.name).toEqual('garnish');
    expect(result.garnish.value).toEqual('lemon');
    expect(result.garnish.required).toEqual(false);
    expect(result.garnish.position).toEqual(1);
    // check that bogus positionals and options are not included
    expect(result.tea).not.toBeDefined();
    expect(result['-l']).not.toBeDefined();
    expect(result['--additions']).not.toBeDefined();
    expect(result.large).not.toBeDefined();
    expect(result.additions).not.toBeDefined();
    expect(result.pineapple).not.toBeDefined();
  });
  
  it('can parse option arguments and flags', function() {
    args.addOption({name: ['-a', '--additions']});
    args.addOption({name: ['-l', '--large'], value: 'XXL', flag: true});
    args.addOption({name: ['-b', '-bg', '--big'], value: 'BIG', flag: true});
    args.addOption({name: '--flavor', value: 'sweet', flag: true});
    result = args.parse(argString);
    /* check if parse succeeded */
    expect(result).toBeInstanceOf(cmdparse);
    /* check if arguments are defined and instantiatiated */
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.large).toBeDefined();
    expect(result.large).toBeInstanceOf(Option);
    expect(result.big).toBeDefined();
    expect(result.big).toBeInstanceOf(Option);
    expect(result.flavor).toBeDefined();
    expect(result.flavor).toBeInstanceOf(Option);
    /* check if arguments' properties are correct */
    expect(result.additions.name).toEqual(['-a', '--additions']);
    expect(result.additions.value).toEqual('pineapple');
    expect(result.additions.required).toEqual(false);
    expect(result.additions.flag).toEqual(false);
    expect(result.large.name).toEqual(['-l', '--large']);
    expect(result.large.value).toEqual('XXL');
    expect(result.large.required).toEqual(false);
    expect(result.large.flag).toEqual(true);
    expect(result.big.name).toEqual(['-b', '-bg', '--big']);
    expect(result.big.value).toEqual('BIG');
    expect(result.big.required).toEqual(false);
    expect(result.big.flag).toEqual(true);
    expect(result.flavor.name).toEqual('--flavor');
    expect(result.flavor.value).toEqual('sweet');
    expect(result.flavor.required).toEqual(false);
    expect(result.flavor.flag).toEqual(true);
    /* check that bogus options and positionals are not included */
    expect(result.bubbletea).not.toBeDefined();
    expect(result.lemon).not.toBeDefined();
    expect(result.tea).not.toBeDefined();
    expect(result['-l']).not.toBeDefined();
    expect(result['--additions']).not.toBeDefined();
    expect(result['--flavor']).not.toBeDefined();
    expect(result.pineapple).not.toBeDefined();
  });
  
  it('can parse compound arguments', function() {
    args.addPositional({name: 'fruit', help: 'extra fruit'});
    args.addOption({name: '--max', value: true, flag: true, help: 'maximize'});
    args.addCompound({name: 'make', help: 'froth tea'});
    args.make.commands.addPositional({name: 'thing', help: 'thing to make'});
    args.make.commands.addOption({name: ['-l', '--large'], value: true, flag: true, help: 'make it bigger'});
    result = args.parse(compoundString);
    /* check that positional and option was assigned */
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.fruit).toBeDefined();
    expect(result.fruit).toBeInstanceOf(Positional);
    expect(result.fruit.value).toEqual('lemon');
    expect(result.max).toBeDefined();
    expect(result.max).toBeInstanceOf(Option);
    expect(result.max.value).toEqual(true);
    /* check compound argument */
    expect(result.make).toBeDefined();
    expect(result.make).toBeInstanceOf(Compound);
    expect(result.make.name).toEqual('make');
    expect(result.make.required).toEqual(true);
    expect(result.make.help).toEqual('froth tea');
    
    expect(result.make.commands).toBeDefined();
    expect(result.make.commands).toBeInstanceOf(cmdparse);
    expect(result.make.commands.__name).toEqual(result.make.name);
    expect(result.make.commands.__description).toEqual(result.make.help);
    
    expect(result.make.commands.thing).toBeDefined();
    expect(result.make.commands.thing).toBeInstanceOf(Positional);
    expect(result.make.commands.thing.value).toEqual('bubbles');
    
    expect(result.make.commands.large).toBeDefined();
    expect(result.make.commands.large).toBeInstanceOf(Option);
    expect(result.make.commands.large.value).toEqual(true);
    
    expect(result.make.commands.max).not.toBeDefined();
  });
  
  it('can do parseArgs successfully', function() {
    let expectation = {fruit: 'lemon', make: {thing: 'bubbles', large: true}};
    args.addPositional({name: 'fruit', help: 'extra fruit'});
    args.addCompound({name: 'make', help: 'froth tea'});
    args.make.commands.addPositional({name: 'thing', help: 'thing to make'});
    args.make.commands.addOption({name: ['-l', '--large'], value: true, flag: true, help: 'make it bigger'});
    result = args.parseArgs(compoundString);
    expect(result).toEqual(expectation);
  });
  
  it('can do parseArgsMap successfully', function() {
    let expectation = new Map();
    expectation.set('fruit', 'lemon');
    let com = new Map();
    com.set('thing', 'bubbles');
    com.set('large', true);
    expectation.set('make', com);
    args.addPositional({name: 'fruit', help: 'extra fruit'});
    args.addCompound({name: 'make', help: 'froth tea'});
    args.make.commands.addPositional({name: 'thing', help: 'thing to make'});
    args.make.commands.addOption({name: ['-l', '--large'], value: true, flag: true, help: 'make it bigger'});
    result = args.parseArgsMap(compoundString);
    expect(result).toEqual(expectation);
  });
});

describe('Default values', function() {
  let args;
  let result;
  let argString;
  beforeEach(function() {
    result = null;
    args = new cmdparse();
    argString = null;
  });
  
  it('are applied to positional arguments when they are omitted', function() {
    args.addPositional({name: 'drink'});
    args.addPositional({name: 'garnish', value: 'coconut', required: false});
    argString = ['bubbletea'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.garnish).toBeDefined();
    expect(result.garnish).toBeInstanceOf(Positional);
    expect(result.garnish.value).toEqual('coconut');
  });
  
  it('are applied to option arguments when they are omitted', function() {
    args.addOption({name: ['-a', '--additions'], value: 'banana'});
    argString = ['bubbletea', '-l'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.additions.value).toEqual('banana');
  });
});

describe('Multiple value options:', function() {
  let args;
  let result;
  let argString;
  beforeEach(function() {
    result = null;
    args = new cmdparse();
    argString = null;
  });
  
  it('\'+\' (one or more) are parsed correctly', function() {
    /* one or more: if the option has this and a default value,
     * the value will be the default value if there are no real values. */
    args.addOption({name: ['-a', '--additions'], nargs: '+'});
    args.addOption({name: ['-m', '--more'], value: 'wont be applied', nargs: '+'});
    args.addOption({name: ['-s', '--somemore'], value: 'will be applied', nargs: '+'});
    args.addOption({name: ['-n', '--nomore'], nargs: '+'});
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', '-n', '-s', '--more', 'berries'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.additions).toBeDefined();
    expect(result.more).toBeDefined();
    expect(result.somemore).toBeDefined();
    expect(result.nomore).not.toBeDefined();

    expect(result.additions).toBeInstanceOf(Option);
    expect(result.more).toBeInstanceOf(Option);
    expect(result.somemore).toBeInstanceOf(Option);
    
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry']);
    expect(result.more.value).toEqual(['berries']);
    expect(result.somemore.value).toEqual('will be applied');
  });

  it('\'*\' (zero or more) are parsed correctly', function() {
    /* zero or more: if the option has zero args but a default
     * value, apply the default value. */
    args.addOption({name: ['-a', '--additions'], nargs: '*'});
    args.addOption({name: ['-m', '--more'], value: 'will be applied', nargs: '*'});
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', '-m'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.more).toBeDefined();
    expect(result.more).toBeInstanceOf(Option);
    // check that value is an array, and contains the values
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry']);
    expect(result.more.value).toEqual('will be applied');
  });

  it('\'n\' max length is respected', function() {
    args.addOption({name: ['-a', '--additions'], nargs: '5'});
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', 'apple', 'mango', 'pineapple'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(cmdparse);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry', 'apple', 'mango']);
  });
});
