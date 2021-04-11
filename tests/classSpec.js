const vargs = require('../vargs.js');
const {Positional, Option} = require('../lib/class.js');

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
  
  xit('can set compound arguments', function() {
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
  //let values;
  //let compounds;
  beforeAll(function() {
    args = new vargs('vargs', 'argument parser');
    args.addPositional = {name: 'drink', value: 'bubbletea', help: 'choose a drink'};
    args.addPositional = {name: 'garnish', value: 'lemon', help: 'choose a garnish', required: false};
    args.addOption = {name: ['-a', '--additions'], help: 'extras'};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', help: 'large size', flag: true};
      
    positionals = [
      new Positional(name='drink', value='bubbletea', required=true, help='choose a drink', position=0),
      new Positional(name='garnish', value='lemon', required=false, help='choose a garnish', position=1)
    ];
    options = [
      new Option(name=['-a', '--additions'], value=null, required=false, help='extras', flag=false),
      new Option(name=['-l', '--large'], value='XXL', required=false, help='large size', flag=true)
    ];
    requireds = [new Positional(name='drink', value='bubbletea', required=true, help='choose a drink', position=0)];
    flags = [new Option(name=['-l', '--large'], value='XXL', required=false, help='large size', flag=true)];
    //values = ['bubbletea', 'lemon', 'XXL'];
  });
  
  it('can get positionals', function() {
    expect(args.positionals).toEqual(positionals);
  });
  
  it('can get options', function() {
    expect(args.options).toEqual(options);
  });     
          
  it('can get requireds', function() {
    expect(args.required).toEqual(requireds);
  });
  
  it('can get flags', function() {
    expect(args.flags).toEqual(flags);
  });
  
  it('can get help', function() {
    console.log('\nshort help: ', args.getShortHelp);
    console.log('\nlong help: ', args.getLongHelp);
  });

  xit('can get compounds', function() {
    expect(args.compounds).toEqual(compounds);
  });
  
  xit('can get values', function() {
    expect(args.values).toEqual(values);
  });
  
  it('can get positional count', function() {
    expect(args.posCount).toEqual(positionals.length);
  });
  
  it('can get options count', function() {
    expect(args.optCount).toEqual(options.length);
  });
  
  it('can get required count', function() {
    expect(args.reqCount).toEqual(requireds.length);
  });
  
  xit('can get compounds count', function() {
    expect(args.comCount).toEqual(compounds.length);
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
    args.addPositional = {name: 'drink', value: 'bubbletea'};
    args.addPositional = {name: 'garnish', value: 'lemon', required: false};
    args.addOption = {name: ['-a', '--additions']};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', flag: true};
  });
  
  it('can return arguments as an object', function() {
    expectation = {drink: 'bubbletea', garnish: 'lemon', additions: null, large: 'XXL'};
    expect(args.toObject()).toEqual(expectation);
  });
  
  it('can return arguments as a map', function() {
    expectation = new Map();
    expectation.set('drink', 'bubbletea');
    expectation.set('garnish', 'lemon');
    expectation.set('additions', null);
    expectation.set('large', 'XXL');
    expect(args.toMap()).toEqual(expectation);
  })
});


