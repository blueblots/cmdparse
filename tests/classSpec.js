const vargs = require('../vargs.js');
const {Positional, Option, Compound} = require('../lib/class.js');

describe('Setters', function() {
  let args;
  beforeEach(function() {
    args = new vargs();
  });
  
  it('can set positional arguments', function() {
    args.addPositional = {name: 'foo', value: '101', required: true};
    expect(args.foo).toBeDefined();
    expect(args.foo).toBeInstanceOf(Positional);
    expect(args.foo.position).toBe(0);
    expect(args.foo.required).toBe(true);
    expect(args.foo.value).toBe('101');
  });
  
  it('can set option arguments', function() {
    args.addOption = {name: ['-b', '--bar'], value: 'foobar', required: true, flag: true};
    expect(args.bar).toBeDefined();
    expect(args.bar).toBeInstanceOf(Option);
    expect(args.bar.flag).toBe(true);
    expect(args.bar.required).toBe(true);
    expect(args.bar.value).toBe('foobar');
  });
  
  it('can set compound arguments', function() {
    args.addCompound = {name: 'boogie', required: false, help: 'dance'};
    args.addCompound = {name: ['-w', '-wgie', 'woogie']};
    expect(args.boogie).toBeDefined();
    expect(args.boogie).toBeInstanceOf(Compound);
    expect(args.boogie.name).toEqual('boogie');
    expect(args.boogie.commands).toBeDefined();
    expect(args.boogie.commands).toBeInstanceOf(vargs);
    expect(args.boogie.commands.__name).toEqual('boogie');
    expect(args.boogie.commands.__description).toEqual('dance');
    expect(args.boogie.required).toEqual(false);
    expect(args.boogie.help).toEqual('dance');
    
    expect(args.woogie).toBeDefined();
    expect(args.woogie).toBeInstanceOf(Compound);
    expect(args.woogie.name).toEqual(['-w', '-wgie', 'woogie']);
    expect(args.woogie.commands).toBeDefined();
    expect(args.woogie.commands).toBeInstanceOf(vargs);
    expect(args.woogie.required).toEqual(true);
    expect(args.woogie.help).toEqual('');
    expect(args.woogie.commands.__name).toEqual('woogie');
    expect(args.woogie.commands.__description).toEqual('');
  });
  
  it('can unset arguments', function() {
    args.addPositional = {name: 'foo', value: '101', required: true};
    args.addOption = {name: ['-b', '--bar'], value: 'foobar', required: true, flag: true};
    args.delArg = 'foo';
    args.delArg = 'bar';
    expect(args.foo).toBeUndefined();
    expect(args.bar).toBeUndefined();
  });
});

describe('Getters', function() {
  let args;
  let positionals;
  let options;
  let requireds;
  let flags;
  let compounds;
  let installCommand;
  beforeAll(function() {
    args = new vargs('vargs', 'argument parser');
    args.addPositional = {name: 'drink', value: 'bubbletea', help: 'choose a drink'};
    args.addPositional = {name: 'garnish', value: 'lemon', help: 'choose a garnish', required: false};
    args.addOption = {name: ['-a', '--additions'], help: 'extras'};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', help: 'large size', flag: true};
    args.addCompound = {name: 'install', help: 'install a package'};
    args.install.commands.addPositional = {name: 'package'};
    args.install.commands.addOption = {name: ['-r', '--recommends'], value: true, flag: true};
      
    positionals = [
      new Positional(name='drink', value='bubbletea', required=true, help='choose a drink', position=0),
      new Positional(name='garnish', value='lemon', required=false, help='choose a garnish', position=1)
    ];
    
    options = [
      new Option(name=['-a', '--additions'], value=null, required=false, help='extras', flag=false, nargs=false),
      new Option(name=['-l', '--large'], value='XXL', required=false, help='large size', flag=true, nargs=false)
    ];
    
    installCommand = new vargs();
    installCommand.__name = 'install';
    installCommand.__description = 'install a package';
    installCommand.addPositional = {name: 'package'};
    installCommand.addOption = {name: ['-r', '--recommends'], value: true, flag: true};
    compounds = [new Compound(name='install', commands=installCommand, required=true, help='install a package')];
    
    requireds = [new Positional(name='drink', value='bubbletea', required=true, help='choose a drink', position=0),
                 new Compound(name='install', commands=installCommand, required=true, help='install a package')];
    
    flags = [new Option(name=['-l', '--large'], value='XXL', required=false, help='large size', flag=true, nargs=false)];
    
  });
  
  it('can get positionals', function() {
    expect(args.positionals).toEqual(positionals);
    expect(args.positionals.length).toEqual(positionals.length);
  });
  
  it('can get options', function() {
    expect(args.options).toEqual(options);
    expect(args.options.length).toEqual(options.length);
  });     
          
  it('can get requireds', function() {
    expect(args.required).toEqual(requireds);
    expect(args.required.length).toEqual(requireds.length);
  });
  
  it('can get flags', function() {
    expect(args.flags).toEqual(flags);
    expect(args.flags.length).toEqual(flags.length);
  });
  
  it('can get help', function() {
    expect(args.getShortHelp).toEqual('\nUSAGE: vargs drink [ garnish ] [ -a,--additions ] [ -l,--large ] ');
    expect(args.getLongHelp).toEqual('\nvargs - argument parser\n\nUSAGE: vargs drink [ garnish ] [ -a,--additions ] [ -l,--large ] \n\ndrink (default: bubbletea)\tchoose a drink\ngarnish (default: lemon)\tchoose a garnish\n\nOPTIONS:\n-a,--additions\textras\n-l,--large (default: XXL)\tlarge size\n');
  });

  it('can get compounds', function() {
    expect(args.compounds).toEqual(compounds);
  });
  
});

describe('Methods', function() {
  let args;
  let expectation;
  
  beforeEach(function() {
    expectation = undefined;
  })
  
  beforeAll(function() {
    args = new vargs();
    args.addPositional = {name: 'drink', value: 'bubbletea', help: 'choose a drink'};
    args.addPositional = {name: 'garnish', value: 'lemon', required: false};
    args.addOption = {name: ['-a', '--additions'], help: 'extras'};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', flag: true};
    args.addCompound = {name: 'froth', help: 'make bubbles'};
    args.froth.commands.addPositional = {name: 'thing', value: 'bubbles', help: 'thing to froth'};
    args.froth.commands.addOption = {name: ['-xxl', '--doubleXL'], value: true, flag: true};
  });
  
  it('can return arguments as an object', function() {
    expectation = {
      drink: 'bubbletea',
      garnish: 'lemon',
      additions: null,
      large: 'XXL',
      froth: {
        thing: 'bubbles',
        doubleXL: true
      }
    };
    expect(args.toObject()).toEqual(expectation);
  });
  
  it('can return arguments as a map', function() {
    expectation = new Map();
    expectation.set('drink', 'bubbletea');
    expectation.set('garnish', 'lemon');
    expectation.set('additions', null);
    expectation.set('large', 'XXL');
    let map = new Map();
    map.set('thing', 'bubbles');
    map.set('doubleXL', true);
    expectation.set('froth', map);
    
    expect(args.toMap()).toEqual(expectation);
  });
  
  // tests for verification functions
  it('can correctly verify a positional', function() {
    expectation = new Positional(name='drink', value='bubbletea', required=true, help='choose a drink', position=0);
    expect(args.verifyPositional(0)).toEqual(expectation);
    expect(args.verifyPositional(5)).toEqual(false);
  });
  
  it('can correctly verify an option', function() {
    expectation = new Option(name=['-a', '--additions'], value=null, required=false, help='extras', flag=false, nargs=false);
    expect(args.verifyOption('-a')).toEqual(expectation);
    expect(args.verifyOption('--additions')).toEqual(expectation);
    expect(args.verifyOption('chocolate')).toEqual(false);
  });
  
  it('can correctly verify a compound', function() {
    let cmd = new vargs(name='froth', description='make bubbles');
    cmd.addPositional = {name: 'thing', value: 'bubbles', help: 'thing to froth'};
    cmd.addOption = {name: ['-xxl', '--doubleXL'], value: true, flag: true};
    expectation = new Compound(name='froth', commands=cmd, required=true, help='make bubbles');
    expect(args.verifyCompound('froth')).toEqual(expectation);
  });
  
  it('can correctly verify required arguments', function() {
    let testVargs = new vargs();
    testVargs.addPositional = {name: 'drink', value: 'bubbletea', help: 'choose a drink'};
    testVargs.addCompound = {name: 'froth', help: 'make bubbles'};
    testVargs.froth.commands.addPositional = {name: 'thing', value: 'bubbles', help: 'thing to froth'};
    testVargs.froth.commands.addOption = {name: ['-xxl', '--doubleXL'], value: true, flag: true};
    let badVargs = new vargs();
    badVargs.addPositional = {name: 'booze', value: 'bubbletea', help: 'choose a drink'};
    expect(args.verifyRequired(testVargs)).toEqual(true);
    expect(args.verifyRequired(badVargs)).toEqual(false);
  });
});


