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
    args = new vargs();
    args.addPositional = {name: 'drink', value: 'bubbletea'};
    args.addPositional = {name: 'garnish', value: 'lemon', required: false};
    args.addOption = {name: ['-a', '--additions']};
    args.addOption = {name: ['-l', '--large'], value: 'XXL', flag: true};
      
    positionals = [
      new Positional(name='drink', value='bubbletea', required=true, position=0),
      new Positional(name='garnish', value='lemon', required=false, position=1)
    ];
    options = [
      new Option(name=['-a', '--additions'], value=null, required=false, flag=false),
      new Option(name=['-l', '--large'], value='XXL', required=false, flag=true)
    ];
    requireds = [new Positional(name='drink', value='bubbletea', required=true, position=0)];
    flags = [new Option(name=['-l', '--large'], value='XXL', required=false, flag=true)];
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


