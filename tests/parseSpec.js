const vargs = require('../vargs.js');
const {Positional, Option} = require('../lib/class.js');

describe('Parser', function() {
  let args;
  let argString = ['bubbletea', 'lemon', 'tea', '-l', '--additions', 'pineapple', '--flavor'];
  let result;
  
  beforeEach(function() {
    result = null;
    args = new vargs();
  });
  
  it('can parse positional arguments', function() {
    args.addPositional = {name: 'drink'};
    args.addPositional = {name: 'garnish', required: false};
    result = args.parse(argString);
    // check if parse succeeded
    expect(result).toBeInstanceOf(vargs);
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
    args.addOption = {name: ['-a', '--additions']};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', flag: true};
    args.addOption = {name: '--flavor', value: 'sweet'};
    result = args.parse(argString);
    // check if parse succeeded
    expect(result).toBeInstanceOf(vargs);
    // check if arguments are defined and instantiatiated
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.large).toBeDefined();
    expect(result.large).toBeInstanceOf(Option);
    expect(result.flavor).toBeDefined();
    expect(result.flavor).toBeInstanceOf(Option);
    // check if arguments' properties are correct
    expect(result.additions.name).toEqual(['-a', '--additions']);
    expect(result.additions.value).toEqual('pineapple');
    expect(result.additions.required).toEqual(false);
    expect(result.additions.flag).toEqual(false);
    expect(result.large.name).toEqual(['-l', '--large']);
    expect(result.large.value).toEqual('XXL');
    expect(result.large.required).toEqual(false);
    expect(result.large.flag).toEqual(true);
    expect(result.flavor.name).toEqual('--flavor');
    expect(result.flavor.value).toEqual('sweet');
    expect(result.flavor.required).toEqual(false);
    expect(result.flavor.flag).toEqual(false);
    // check that bogus options and positionals are not included
    expect(result.bubbletea).not.toBeDefined();
    expect(result.lemon).not.toBeDefined();
    expect(result.tea).not.toBeDefined();
    expect(result['-l']).not.toBeDefined();
    expect(result['--additions']).not.toBeDefined();
    expect(result['--flavor']).not.toBeDefined();
    expect(result.pineapple).not.toBeDefined();
  });
  
  xit('can parse compound arguments', function() {
      
  });
});

//TODO
xdescribe('Default values', function() {
  let args;
  let result;
  let argString;
  beforeEach(function() {
    result = null;
    args = new vargs();
    argString = null;
  });
  //TODO
  it('are applied to positional arguments when they are omitted', function() {
    args.addPositional = {name: 'drink'};
    args.addPositional = {name: 'garnish', value: 'coconut', required: false};
    argString = ['bubbletea', '-l', '-X'];
    result = args.parse(argString);
    // check if parse succeeded
    expect(result).toBeInstanceOf(vargs);
    // check if arguments are defined and instantiatiated
    expect(result.garnish).toBeDefined();
    expect(result.garnish).toBeInstanceOf(Positional);
    // check if arguments' properties are correct
    expect(result.garnish.value).toEqual('coconut');
  });
  //TODO
  it('are applied to option arguments when they are omitted', function() {
    args.addOption = {name: ['-a', '--additions'], value: 'banana'};
    argString = ['bubbletea', '-l'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(vargs);
    // check if arguments are defined and instantiatiated
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    // check if arguments' properties are correct
    expect(result.additions.value).toEqual('banana');
  });
});

//TODO
xdescribe('Multiple value options:', function() {
  let args;
  let result;
  let argString;
  beforeEach(function() {
    result = null;
    args = new vargs();
    argString = null;
  });
  //TODO
  it('\'+\' (one or more) are parsed correctly', function() {
    /* one or more: if the option has this and a default value,
     * the value should be ignored. */
    args.addOption = {name: ['-a', '--additions'], nargs: '+'};
    args.addOption = {name: ['-m', '--more'], value: 'wont be applied', nargs: '+'};
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', '-m'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(vargs);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.more).not.toBeDefined();
    // check that value is an array, and contains the values
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry']);
  });
  //TODO
  it('\'*\' (zero or more) are parsed correctly', function() {
    /* zero or more: if the option has zero args but a default
     * value, apply the default value. */
    args.addOption = {name: ['-a', '--additions'], nargs: '*'};
    args.addOption = {name: ['-m', '--more'], value: 'will be applied', nargs: '*'};
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', '-m'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(vargs);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.more).toBeDefined();
    expect(result.more).toBeInstanceOf(Option);
    // check that value is an array, and contains the values
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry']);
    expect(result.more.value).toEqual('will be applied');
  });
  //TODO
  it('\'n\' max length is respected', function() {
    args.addOption = {name: ['-a', '--additions'], nargs: '5'};
    argString = ['bubbletea', '-a', 'coconut', 'lychee', 'cherry', 'apple', 'mango', 'pineapple'];
    result = args.parse(argString);
    expect(result).toBeInstanceOf(vargs);
    expect(result.additions).toBeDefined();
    expect(result.additions).toBeInstanceOf(Option);
    expect(result.additions.value).toEqual(['coconut', 'lychee', 'cherry', 'apple', 'mango']);
  });
});
