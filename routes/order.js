/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Order = require('../proxy').Order;
var Customer = require('../proxy').Customer;
var Category = require('../proxy').Category;
var moment = require('moment');
var Company = require('../proxy').Company;

router.get('/details/:id', function (req, res) {
    var orderId = req.params['id'];
    Order.getOrderById(orderId, function (err, order) {
        var msg = err ? err.toString() : '';
        if (!order) {
            msg = 'Order does not exist.';
        }
        Company.getCompany(function (err, company) {
            res.render('order_detail', {order: order, msg: msg, company: company, title: 'Order Details-No.' + order.no});
        });
    });
});

router.get('/list.html', function (req, res) {
    var no = req.param('no');
    if (no) {
        return Order.getOrderById(no, function (err, order) {
            var msg = err ? err.toString() : '';
            if (!order) {
                msg = 'Order does not exist.';
            }
            res.render('order_list', {title: 'Order', orders: (order ? [order] : [])});
        });
    }
    var date = req.param('date');
    if (date) {
        return Order.getOrderByParams({create_at: date}, function (err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.render('order_list', {title: 'Order', orders: (orders || [])});
        });
    }
    return Order.getAllOrder(function (err, orders) {
        res.render('order_list', {title: 'Order', orders: (orders || [])});
    });
});

router.get('/get.html', function (req, res) {
    var params = req.param('params'), key;
    params = params || {};
    for (key in params) {
        break;
    }
    if (key) {
        Order.getOrderByParams(params, function (err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.json({status: status, orders: (orders || [])});
        });
    } else {
        Order.getAllOrder(function (err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.json({status: status, orders: orders || []});
        });
    }
});

router.get('/index.html', function (req, res) {
    Customer.findAllCustomers(function (err, customers) {
        Category.getAllCategory(function (err, category) {
            res.render('order', {title: 'Order', customer: customers || [], category: category || []});
        });
    });
});

router.post('/add.html', function (req, res) {
    var order = req.param('order');
    Order.createOrder(order, function (err, order) {
        if (err) {
            return res.json({status: 'error', msg: err.toString()});
        }
        res.json({status: 'success', order: order});
    });
});

module.exports = router;