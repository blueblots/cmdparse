// TODO
describe("Option test", function() {
  const {vargs} = require('../vargs');
  let testInput;
  let testVargs;
  
  beforeEach(function() {
    testInput = ['-v', '--target', 'usr/share', '-c'];
    testVargs = new vargs();
  });
  
  it("correctly receives arguments", function() {
    // check that defaults load correctly
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    expect(testVargs.verbose).toBeDefined();
    expect(testVargs.verbose.position).not.toBeDefined();
    expect(testVargs.verbose.flag).toEqual(true);
    expect(testVargs.verbose.name).toEqual(['-v', '--verbose']);
    expect(testVargs.verbose.value).toBeNull();
    expect(testVargs.verbose.required).toBeTrue();
    expect(testVargs.optCount).toEqual(1);
    
    // check that single names are processed correctly
    testVargs.addArg = {name: '--target', positional: false};
    expect(testVargs.target).toBeDefined();
  });
  
  it("correctly parses option arguments", function() {
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
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    let parse = testVargs.parseArgs(testInput.slice(1));
    expect(parse).toBeFalse();
  });

});
