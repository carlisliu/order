var rewire = require("rewire");
var resourceHandler = rewire('../middleware/resources');
var resourceHolder = require('../middleware/resources/resources');
var assert = require('assert');

describe('#Item', function() {
	it('Item should be a function', function() {
		assert.equal('function', typeof resourceHandler.__get__('Item'));
	});

	it('item should return script tags', function() {
		var Item = resourceHandler.__get__('Item');
		var item = new Item('js', ['http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js']);
		assert.equal('<script type="text/javascript" src="http://localhost:3000/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js"></script>', item.toString());
	});
});

describe('#concatScript', function() {
	it('concatScript should be a function', function() {
		assert.equal('function', typeof resourceHandler.__get__('concatScript'));
	});

	it('concatScript should return script tags', function() {
		var concatScript = resourceHandler.__get__('concatScript');

		assert.equal('<link rel="stylesheet" href="http://localhost:3000//stylesheets/bootstrap.css">',
			concatScript('css', {
				href: 'http://localhost:3000//stylesheets/bootstrap.css'
			}));

		assert.equal('<script type="text/javascript" src="http://localhost:3000//javascripts/sea-modules/seajs/seajs/3.0.0/sea.js"></script>',
			concatScript('js', {
				src: 'http://localhost:3000//javascripts/sea-modules/seajs/seajs/3.0.0/sea.js'
			}));
	});
});

describe('#resourceHandler', function() {
	it('resourceHandler should be an object', function() {
		assert.equal('object', typeof resourceHandler);
	});

	it('resourceHandler should contains css and js property that also should be object', function() {
		assert.equal('object', typeof resourceHandler.css);
		assert.equal('object', typeof resourceHandler.js);
	});
});

describe('#process', function() {
	var process = resourceHandler.__get__('process');

	it('process should be a function', function() {
		assert.equal('function', typeof process);
	});

	it('layout and index should return script tags script', function() {
		var js = {
			'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js'],
			'index': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js', '/javascripts/static/all.min.js']
		};
		var css = {
			'layout': ['/stylesheets/bootstrap.css', '/stylesheets/bootstrap-responsive.css',
				'/stylesheets/jquery.fancybox.css', '/stylesheets/style.css', '/stylesheets/jquery.jgrowl.css'
			],
			'index': ['/stylesheets/all.css']
		};
		process('js', js);
		assert.equal('<script type="text/javascript" src="/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js"></script>', js.layout);
		assert.equal('<script type="text/javascript" src="/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js"></script><script type="text/javascript" src="/javascripts/static/all.min.js"></script>', js.index);
	});

	it('_layout and _index should return object that contains get method', function() {
		var js = {
			'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js'],
			'index': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js', '/javascripts/static/all.min.js']
		};
		var css = {
			'layout': ['/stylesheets/bootstrap.css', '/stylesheets/bootstrap-responsive.css',
				'/stylesheets/jquery.fancybox.css', '/stylesheets/style.css', '/stylesheets/jquery.jgrowl.css'
			],
			'index': ['/stylesheets/all.css']
		};
		process('js', js);
		assert.equal('object', typeof js._layout);
		assert.equal('function', typeof js._layout.get);
		assert.equal('object', typeof js._index);
		assert.equal('function', typeof js._index.get);
	});

	it('get method should return single script and empty value when overflow', function() {
		var js = {
			'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js'],
			'index': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js', '/javascripts/static/all.min.js']
		};
		var css = {
			'layout': ['/stylesheets/bootstrap.css', '/stylesheets/bootstrap-responsive.css',
				'/stylesheets/jquery.fancybox.css', '/stylesheets/style.css', '/stylesheets/jquery.jgrowl.css'
			],
			'index': ['/stylesheets/all.css']
		};
		process('js', js);
		assert.equal('<script type="text/javascript" src="/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js"></script>', js._layout.get(0));
		assert.equal('', js._layout.get(1));
		assert.equal('<script type="text/javascript" src="/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js"></script>', js._index.get(0));
		assert.equal('<script type="text/javascript" src="/javascripts/static/all.min.js"></script>', js._index.get(1));
		assert.equal('', js._index.get(2));
	});
});