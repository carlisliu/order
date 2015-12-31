var rewire = require("rewire");
var userRouter = rewire('../routes/index');
var assert = require('assert');
var fs = require('fs');

describe('#remote', function() {
	it('md5 should be a function', function() {
		assert.equal('function', typeof userRouter.__get__('remote'));
	});
	
	it('remote triggered', function(done) {
		//this.timeout(5000);
		var file = fs.createWriteStream('file.txt');
		userRouter.__get__('remote')(file, done);
	});
});
