/**
 * Created by Carlis on 4/8/15.
 */

var Order = require('../models').Order,
    OrderDetail = require('../models').OrderDetail,
    utils = require('../utils/utils');

exports.createOrder = function (order, callback) {
    var order2Save;
    if (order && order.details && order.details.length) {
        order2Save = new Order();
        order2Save.no = utils.getOrderNo();
        utils.copyProperties(order2Save, order, ['customer_id', 'company_id', 'customer_name', 'customer_tel', 'customer_address']);
        order2Save.details = [];
        order.details.forEach(function (content, index) {
            var orderDetail = new OrderDetail();
            utils.copyProperties(orderDetail, content, ['category_id', 'category_name', 'product_id', 'product_name', 'product_price', 'product_qty']);
            order2Save.details.push(orderDetail);
        });
        order2Save.save(function (err) {
            if (err) {
                return callback(err);
            }
            order.no = order2Save.no;
            callback(null, order);
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

exports.getOrderById = function (id, callback) {
    if (!id) {
        return callback(new Error("Order's id can not be empty"));
    }
    Order.findOne({no: id}, callback);
};

exports.getAllOrder = function (companyId, callback) {
    Order.find({company_id: companyId}).sort({create_at: -1}).exec(callback);
};

exports.getOrderByParams = function (params, callback) {
    var date, instance;
    if (params.create_at) {
        date = params.create_at;
        delete  params.create_at;
    }
    instance = Order.find(params);
    if (date) {
        instance.where('create_at').gt(new Date(date)).lt(new Date(date + ' 23:59:59'));
    }
    instance.exec(callback);
};

exports.findOrderById = function (order, callback) {
    return Order.findOne(order, callback);
};

exports.findOrders = function (order, callback) {
    return Order.find(order, callback);
};