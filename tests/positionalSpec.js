// TODO
describe("Positional test", function() {
  const {vargs} = require('../vargs');
  let testInput;
  let testVargs;
  
  beforeEach(function() {
    testInput = ['cocktail', 'slush', 'icetea'];
    testVargs = new vargs();
  });
  
  it("correctly receives arguments", function() {
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
  
  it("correctly parses positional arguments", function() {
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
    testVargs.addArg = {name: 'booze'};
    testVargs.addArg = {name: 'softdrink'};
    testVargs.addArg = {name: 'tea'};
    let parse = testVargs.parseArgs(testInput.slice(1));
    expect(parse).toBeFalse();
  });

});
