var User = require('../models').User;

exports.findUserById = function(id, callback) {
	return User.findOne({
		id: id
	}, callback);
};

exports.updateUser = function (id, userProps, callback) {
	return User.update({id: id}, {'$set': userProps}, callback);
};