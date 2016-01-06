//var util = require('util');
var resources = require('./resources');
var scriptType = {
	js: 'script type="text/javascript"',
	css: 'link rel="stylesheet"'
};

function Item(type, items) {
	this.type = type;
	this.items = items || [];
}

Item.prototype.get = function(index) {
	var item = this.items[index];
	var type = this.type;
	if (!item) {
		return '';
	}
	if (type === 'js') {
		attr = 'src';
	} else if (type === 'css') {
		attr = 'href';
	}
	var prop = {};
	prop[attr] = item;
	return concatScript(type, prop);
};

Item.prototype.toString = function() {
	var type = this.type;
	if (!this.items || !this.items.length) {
		return '';
	}
	if (type === 'js') {
		attr = 'src';
	} else if (type === 'css') {
		attr = 'href';
	}
	return this.items.map(function (url) {
		var prop = {};
		prop[attr] = url;
		return concatScript(type, prop);
	}).join('');
};

function Resource(resources) {
	for (var type in resources) {
		this[type] = process(type, resources[type]);
	}
}

function process(type, obj) {
	var result;
	if (type === 'js') {
		attr = 'src';
	} else if (type === 'css') {
		attr = 'href';
	}
	iterator(obj, function(resources, page) {
		obj[page] = resources.map(function(url) {
			var attrObj = {};
			attrObj[attr] = url;
			return concatScript(type, attrObj);
		}).join('');
		obj['_' + page] = new Item(type, resources);
	});
	return obj;
}

function concatScript(type, prop) {
	var script = '<';
	script += scriptType[type] || '';
	iterator(prop, function(val, key) {
		script += (' ' + key + '="' + val + '"');
	});
	if (type === 'js') {
		script += '></script>';
	} else if (type === 'css') {
		script += '>';
	} else {
		script += '/>';
	}
	return script;
}

function iterator(obj, func) {
	for (var key in obj) {
		if (func.call(obj[key], obj[key], key, obj) === false) {
			return;
		}
	}
}

var res = new Resource(resources);
module.exports = res;