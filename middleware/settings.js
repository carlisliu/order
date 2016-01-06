var config = require('../config');
var url = require('url');

var host = config.host;
var staticServer = config.staticServer;
var staticResourcePath = config.staticResourcePath;
var staticUrl = url.resolve(staticServer, staticResourcePath);

exports = module.exports = function (req, res, next) {
	res.locals.context = {
		nodeEnv: process.env.NODE_ENV || 'development',
		host: host,
		staticUrl: staticUrl
	};
    next();
};