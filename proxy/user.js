var User = require('../models').User;
var _ = require('lodash');

exports.findUserById = function(id, callback) {
	return User.findOne({
		id: id
	}, callback);
};

exports.saveUser = function(user, callback) {
	var _user = new User();
	_.assign(_user, user);
	_user.save(function(error) {
		callback(error);
	});
};

exports.findUsers = function(params, callback) {
	User.find(params, callback);
};

exports.findOneUser = function(params, callback) {
	User.findOne(params, callback);
};

exports.removeUser = function(params, callback) {
	User.remove(params, callback);
};

exports.updateUser = function(id, userProps, callback) {
	return User.update({
		id: id
	}, {
		'$set': userProps
	}, callback);
};