// TODO
describe("Positional tests for vargs -", function() {
  const {vargs} = require('../vargs');
  let testInput;
  let testVargs;
  
  beforeEach(function() {
    testInput = [];
    testVargs = new vargs();
  });
  
  it("can correctly count the number of positional arguments", function() {
    testVargs.addArg = {name: 'booze'};
    testVargs.addArg = {name: 'softdrink'};
    testVargs.addArg = {name: 'tea'};
    expect(testVargs.posCount).toEqual(3);
  });
  
  it("can return a correct listing of positional arguments", function() {
    testVargs.addArg = {name: 'booze'};
    testVargs.addArg = {name: 'softdrink'};
    testVargs.addArg = {name: 'tea'};
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    testVargs.addArg = {name: '--garnish', positional: false};
    expect(testVargs.positionals.length).toEqual(3);
  });
  
  it("can correctly receive arguments", function() {
    // check that defaults load correctly
    testVargs.addArg = {name: 'booze'};
    expect(testVargs.booze).toBeDefined();
    expect(testVargs.booze.position).toBeDefined();
    expect(testVargs.booze.name).toEqual('booze');
    expect(testVargs.booze.value).toBeNull();
    expect(testVargs.booze.required).toBeTrue();
    expect(testVargs.posCount).toEqual(1);
    
    // check that multiple names are processed correctly
    testVargs.addArg = {name: ['softdrink', 'cola']};
    expect(testVargs.cola).toBeDefined();
  });
  
  it("can correctly parse positional arguments", function() {
    testInput = ['cocktail', 'slush', 'icetea'];
    testVargs.addArg = {name: 'booze'};
    testVargs.addArg = {name: 'softdrink'};
    testVargs.addArg = {name: 'tea'};
    let parse = testVargs.parseArgs(testInput);
    expect(parse).toBeInstanceOf(vargs);
    expect(parse.posCount).toEqual(testInput.length);
    expect(parse.posCount).toEqual(testVargs.posCount);
    for (let i = 0; i < Object.keys(parse); i++) {
      expect(parse[Object.keys(parse)[i]].value).toEqual(testInput[i]);
    }
  });
  
  it("returns false if required arguments are missing", function() {
    testInput = ['cocktail', 'slush', 'icetea'];
    testVargs.addArg = {name: 'booze'};
    testVargs.addArg = {name: 'softdrink'};
    testVargs.addArg = {name: 'tea'};
    let parse = testVargs.parseArgs(testInput.slice(1));
    expect(parse).toBeFalse();
  });
  
  it("ignores out of position arguments that are not required", function() {
    testInput = ['--add', 'cocktail', 'slush', 'icetea'];
    testVargs.addArg = {name: 'booze', required: false};
    testVargs.addArg = {name: 'softdrink', required: false};
    testVargs.addArg = {name: 'tea'};
    testVargs.addArg = {name: '--add', positional: false, required: false, flag: false};
    let parse = testVargs.parseArgs(testInput);
    expect(parse).not.toBeFalse;
    expect(parse.booze).toBeUndefined();
    expect(parse.softdrink).toBeUndefined();
  });
  
  it("does not interpret an option's value as a positional argument", function() {
    testInput = ['cocktail', '--add', 'icetea'];
    testVargs.addArg = {name: 'booze', required: false};
    testVargs.addArg = {name: 'softdrink', required: false};
    testVargs.addArg = {name: 'tea', required: false};
    testVargs.addArg = {name: '--add', positional: false, flag: false};
    let parse = testVargs.parseArgs(testInput);
    expect(parse.add.value).toEqual('icetea');
    expect(parse.tea).toBeUndefined();
  });

});
