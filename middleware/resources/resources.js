var config = require('../../config');
var url = require('url');

var staticServer = config.staticServer;
console.log(staticServer);
var staticResourcePath = config.staticResourcePath;
console.log(staticResourcePath);
var basePath = url.resolve(staticServer, staticResourcePath);
console.log(basePath);
var nodeEnv = process.env.NODE_ENV || 'development';
var js = {
	'development': {
		'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js']
	},
	'production': {
		'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js', '/javascripts/static/all.min.js']
	}
};

var css = {
	'development': {
		'layout': ['/stylesheets/bootstrap.css', '/stylesheets/bootstrap-responsive.css', 
				'/stylesheets/jquery.fancybox.css', '/stylesheets/style.css', '/stylesheets/jquery.jgrowl.css']
	},
	'production': {
		'layout': ['/stylesheets/all.css']
	}
};

function parseResource(recourses) {
	for(var page in recourses) {
		recourses[page] = recourses[page].map(function (path) {
			return basePath + path;
		});
	}
	return recourses;
}

var parsedJs = parseResource(js[nodeEnv]);
var parsedCss = parseResource(css[nodeEnv]);

module.exports = {
	js: parsedJs,
	css: parsedCss
};