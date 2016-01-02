var Order = require('../../models').Order;

exports.findAll = function (callback) {
	return Order.find(callback);
};

exports.findById = function (id, callback) {
	return Order.findOne({_id: id}, callback);
};