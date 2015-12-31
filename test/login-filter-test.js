var rewire = require("rewire");
var loginFilter = rewire('../middleware/login-filter');
var assert = require('assert');

describe('#isStaticFile', function() {
	it('isStaticFile should be a function', function() {
		assert.equal('function', typeof loginFilter.__get__('isStaticFile'));
	});
	it('http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js should be a static file', function() {
		var isStaticFile = loginFilter.__get__('isStaticFile');
		assert.equal(true, isStaticFile('http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js'));
	});

	it('http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery1.js should be a static file', function() {
		var isStaticFile = loginFilter.__get__('isStaticFile');
		assert.equal(true, isStaticFile('http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js'));
	});
});

describe('#isApi', function() {
	it('isApi should be a function', function() {
		assert.equal('function', typeof loginFilter.__get__('isApi'));
	});
	it('http://localhost:3000/api/order should be a api url', function() {
		var isApi = loginFilter.__get__('isApi');
		assert.equal(true, isApi('http://localhost:3000/api/order'));
	});

	it('http://localhost:3000/api/order/f452fdsf45kkf4fs should be a api url', function() {
		var isApi = loginFilter.__get__('isApi');
		assert.equal(true, isApi('http://localhost:3000/api/order/f452fdsf45kkf4fs'));
	});
});