module.exports = function(req, res, next) {
	res.handler = handler;
	next();
};

function handler(callback) {
	var self = this;
	if (callback instanceof Error) {
		return handle(self, callback);
	}
	return function(error, results) {
		if (error) {
			return handle(self, error);
		}
		callback(results);
	};
}

function handle(res, error) {
	return res.json({
		status: 'error',
		msg: error.message || 'Error'
	});
}