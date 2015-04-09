/**
 * Created by Carlis on 4/8/15.
 */

var Order = require('../models').Order,
    OrderDetail = require('../models').OrderDetail,
    utils = require('../utils/utils');

exports.createOrder = function (order, callback) {
    if (order) {
        var order2Save = new Order();
        order2Save.no = utils.getOrderNo();
        utils.extend(order2Save, order, []);
        order2Save.save(function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, order2Save);
        });
    } else {
        callback(new Error('Order info is empty.'));
    }
};

exports.updateOrder = function (order, callback) {
    if (order) {
        var orderDetails = [new OrderDetail()];
        Order.update({id: order.id}, {'$set': {
            customer_id: order.customer_id,
            customer_name: order.customer_name,
            customer_address: order.customer_address,
            customer_tel: order.customer_tel,
            memo: order.memo,
            details: orderDetails
        }}, function (err) {
            callback(err, order);
        });
    }
    else {
        callback(new Error('Order info is empty.'));
    }
};

exports.getAllOrder = function (callback) {
    Order.find(callback);
}