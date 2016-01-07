var config = require('../config');
var url = require('url');
var resources = require('./resources');

var host = config.host;
var staticServer = config.staticServer;
var staticResourcePath = config.staticResourcePath;
var staticUrl = url.resolve(staticServer, staticResourcePath);


exports = module.exports = function (req, res, next) {
	res.locals.session = req.session;
	res.locals.context = {
		staticUrl: staticUrl,
		resources: resources
	};
    next();
};