/**
 * Created by Carlis on 4/8/15.
 */
var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db.url, {
	db: {
		native_parser: true
	},
	user: config.db.username,
	pass: config.db.password
}, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db.url, err.message);
		process.exit(1);
	}
});

// models
require('./category');
require('./customer');
require('./order');
require('./product');
require('./company');
require('./user');

exports.Category = mongoose.model('Category');
exports.Customer = mongoose.model('Customer');
exports.Order = mongoose.model('Order');
exports.OrderDetail = mongoose.model('OrderDetail');
exports.Product = mongoose.model('Product');
exports.Company = mongoose.model('Company');
exports.User = mongoose.model('User');