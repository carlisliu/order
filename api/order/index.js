var Order = require('../../models').Order;

exports.findAll = function (callback) {
	return Order.find(callback);
};