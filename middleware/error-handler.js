module.exports = function(req, res, next) {
	res.handler = handler;
	next();
};

function handler(res, callback) {
	return function(error, results) {
		if (error) {
			return res.json({
				status: 'error',
				msg: error.message || 'Error'
			});
		}
		callback(results);
	};
}