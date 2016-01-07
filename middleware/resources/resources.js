var config = require('../../config');
var url = require('url');

var staticServer = config.staticServer;
var staticResourcePath = config.staticResourcePath;
var basePath = url.resolve(staticServer, staticResourcePath);

var nodeEnv = process.env.NODE_ENV || 'development';

var DOUBLE_SLASH_RE = /([^:/])\/\//g;

var js = {
	'development': {
		'login': ['/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js', '/javascripts/sea-modules/backstretch/2.0.4/jquery.backstretch.min.js'],
		'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js']
	},
	'production': {
		'login': ['/javascripts/sea-modules/jquery/jquery/1.10.1/jquery.js', '/javascripts/sea-modules/backstretch/2.0.4/jquery.backstretch.min.js'],
		'layout': ['/javascripts/sea-modules/seajs/seajs/3.0.0/sea.js', '/javascripts/static/all.min.js']
	}
};
var css = {
	'development': {
		'login': ['/stylesheets/bootstrap/v3.3.4/bootstrap.min.css', '/stylesheets/font-awesome/css/font-awesome.min.css',
			'/stylesheets/login/form-elements.css', '/stylesheets/login/style.css'
		],
		'layout': ['/stylesheets/bootstrap.css', '/stylesheets/bootstrap-responsive.css',
			'/stylesheets/jquery.fancybox.css', {
				url: '/stylesheets/style.css',
				media: 'all'
			}, '/stylesheets/jquery.jgrowl.css'
		],
		'order_list': ['/stylesheets/datepicker.css']
	},
	'production': {
		'login': ['/stylesheets/bootstrap/v3.3.4/bootstrap.min.css', '/stylesheets/font-awesome/css/font-awesome.min.css',
			'/stylesheets/login/login.all.css'
		],
		'layout': ['/stylesheets/all.css'],
		'order_list': ['/stylesheets/datepicker.css']
	}
};

function parseResource(recourses) {
	for (var page in recourses) {
		recourses[page] = recourses[page].map(function(path) {
			var realPath;
			if (typeof path === 'string') {
				realPath = basePath + path;
				return realPath.replace(DOUBLE_SLASH_RE, "$1/");
			}
			realPath = basePath + path['url'];
			path['url'] = realPath.replace(DOUBLE_SLASH_RE, "$1/");
			return path;
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