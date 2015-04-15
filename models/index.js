/**
 * Created by Carlis on 4/8/15.
 */
var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {
    db: { native_parser: true },
    user: config.username,
    pass: config.password
}, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./category');
require('./customer');
require('./order');
//require('./order_detail');
require('./product');

exports.Category = mongoose.model('Category');
exports.Customer = mongoose.model('Customer');
exports.Order = mongoose.model('Order');
exports.OrderDetail = mongoose.model('OrderDetail');
exports.Product = mongoose.model('Product');
