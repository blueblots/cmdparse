// TODO
describe("Option test for vargs -", function() {
  const {vargs} = require('../vargs');
  let testInput;
  let testVargs;
  
  beforeEach(function() {
    testInput = [];
    testVargs = new vargs();
  });
  
  it("can correctly receive optional arguments", function() {
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
    //console.log(testVargs);
    expect(testVargs.target).toBeDefined();
  });
  
  it("can correctly parse option arguments", function() {
    testInput = ['-v', '--target', 'usr/share', '-a', 'file.txt'];
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    testVargs.addArg = {name: ['-a', '--append'], positional: false, flag: false, required: false};
    testVargs.addArg = {name: '--target', positional: false, flag: false};
    let parse = testVargs.parseArgs(testInput);
    //console.log(parse);
    //console.log(testVargs);
    expect(parse.reqCount).toEqual(testVargs.reqCount);
    expect(parse.optCount).toEqual(testVargs.optCount);
    for (let i = 0; i < Object.keys(parse); i++) {
      expect(parse[Object.keys(parse)[i]].value).toEqual(testInput[i]);
    }
  });
  
  it("returns false if required arguments are missing", function() {
    testInput = ['-v', '--target', 'usr/share', '-a'];
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    let parse = testVargs.parseArgs(testInput.slice(1));
    expect(parse).toBeFalse();
  });
  
  it("does not accept another option as an option's value", function() {
    testInput = ['--target', '-v', '--append', 'home/foo'];
    testVargs.addArg = {name: ['-v', '--verbose'], positional: false};
    testVargs.addArg = {name: ['-t', '--target'], positional: false, required: false, flag: false};
    testVargs.addArg = {name: ['-a', '--append'], positional: false, flag: false};
    let parse = testVargs.parseArgs(testInput);
    expect(parse.target).toBeUndefined();
  });
  
});
