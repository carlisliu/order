var rewire = require("rewire");
var userRouter = rewire('../routes/users');
var assert = require('assert');

describe('#md5', function() {
	it('md5 should be a function', function() {
		assert.equal('function', typeof userRouter.__get__('md5'));
	});
	it('root -> 63a9f0ea7bb98050796b649e85481845', function() {
		var md5 = userRouter.__get__('md5');
		assert.equal('63a9f0ea7bb98050796b649e85481845', md5('root'));
	});
	
	it('the same string after using md5 should be equal', function() {
		var md5 = userRouter.__get__('md5');
		assert.equal(md5('carlis'), md5('carlis'));
		assert.equal(md5('萌'), md5('萌'));
		assert.equal(md5('carlis 萌'), md5('carlis 萌'));
		assert.equal(md5('#￥@%%……#$#vd'), md5('#￥@%%……#$#vd'));
	});
});
