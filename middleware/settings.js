var config = require('../config');
var nodeEnv = process.env.NODE_ENV || 'development';
var host = config.host[nodeEnv];
var staticUrl = nodeEnv === 'development' ? '' : '/dist';

exports = module.exports = function (req, res, next) {
	res.locals.context = {
		nodeEnv: nodeEnv,
		host: host,
		staticUrl: staticUrl
	};
    next();
};