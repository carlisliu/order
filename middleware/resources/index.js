var util = require('../../utils/utils');
var resources = require('./resources');
var scriptType = {
	js: 'script type="text/javascript"',
	css: 'link rel="stylesheet"'
};

function Item(items) {
	this.items = items || [];
}

Item.prototype.get = function(index) {
	return this.items[index] || '';
};

Item.prototype.toString = function() {
	if (!this.items || !this.items.length) {
		return '';
	}
	return this.items.join('');
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
		resources = resources.map(function(url) {
			var attrObj = {};
			if (typeof url === 'string') {
				attrObj[attr] = url;
			} else {
				attrObj[attr] = url.url;
				delete url.url;
				util.extend(attrObj, url);
			}
			return concatScript(type, attrObj);
		});
		obj[page] = resources.join('');
		obj['_' + page] = new Item(resources);
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