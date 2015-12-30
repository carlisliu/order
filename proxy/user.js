var User = require('../models').User;

exports.findUserById = function(id, callback) {
	return User.findOne({
		id: id
	}, callback);
};