var rewire = require("rewire");
var resourceHolder = rewire('../middleware/resources/resources');
var assert = require('assert');

describe('#resourceHolder', function() {


	it('resourceHolder should be an object', function() {
		assert.equal('object', typeof resourceHolder);
	});

	it('resourceHolder.js should be an object', function() {
		console.log(resourceHolder.js);
		assert.equal('object', typeof resourceHolder.js);
	});

	it('resourceHolder.css should be an object', function() {
		console.log(resourceHolder.css);
		assert.equal('object', typeof resourceHolder.css);
	});

	it('staticServer should be http://localhost:3000', function() {
		assert.equal('http://localhost:3000', resourceHolder.__get__('staticServer'));
	});

	it('staticResourcePath should be empty', function() {
		assert.equal('', resourceHolder.__get__('staticResourcePath'));
	});

});