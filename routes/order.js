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
var EventProxy = require('eventproxy');

router.get('/details/:id', function(req, res) {
    var orderId = req.params['id'];
    var company = req.session.user.company;
    Order.findOrderById({
        no: orderId,
        company_id: company.id
    }, function(err, order) {
        var msg = err ? err.toString() : '';
        if (!order) {
            msg = 'Order does not exist.';
        }
        res.render('order_detail', {
            order: order,
            msg: msg,
            company: company,
            title: 'Order Details-No.' + order.no
        });
    });
});

router.get('/list.html', function(req, res) {
    var no = req.param('no');
    var companyId = req.session.user.company.id;
    if (no) {
        return Order.findOrderById({
            no: no,
            company_id: companyId
        }, function(err, order) {
            var msg = err ? err.toString() : '';
            if (!order) {
                msg = 'Order does not exist.';
            }
            res.render('order_list', {
                title: 'Order',
                orders: (order ? [order] : [])
            });
        });
    }
    var date = req.param('date');
    if (date) {
        return Order.getOrderByParams({
            create_at: date,
            company_id: companyId
        }, function(err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.render('order_list', {
                title: 'Order',
                orders: (orders || [])
            });
        });
    }
    return Order.getAllOrder(companyId, function(err, orders) {
        res.render('order_list', {
            title: 'Order',
            orders: (orders || [])
        });
    });
});

router.get('/get.html', function(req, res) {
    var params = req.param('params'),
        key,
        companyId = req.session.user.company.id;
    params = params || {};
    for (key in params) {
        break;
    }
    if (key) {
        params.company_id = companyId;
        Order.getOrderByParams(params, function(err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.json({
                status: status,
                orders: (orders || [])
            });
        });
    } else {
        Order.getAllOrder(companyId, function(err, orders) {
            var status = 'success';
            if (err) {
                status = 'error'
            }
            res.json({
                status: status,
                orders: orders || []
            });
        });
    }
});

router.get('/index.html', function(req, res) {
    var companyId = req.session.user.company.id;
    var ep = new EventProxy();
    ep.assign('customers', 'categories', function(customers, categories) {
        res.render('order', {
            title: 'Order',
            customer: customers || [],
            category: categories || []
        });
    });
    var param = {
        company_id: companyId
    };
    Customer.findCustomers(param, ep.done('customers'));
    Category.findCategories(param, ep.done('categories'))
});

router.post('/add.html', function(req, res) {
    var order = req.param('order');
    if (!order) {
        return res.json({
            status: 'error',
            msg: 'Order info is incomplete.'
        });
    }
    order.company_id = req.session.user.company.id;
    Order.createOrder(order, function(err, order) {
        if (err) {
            return res.json({
                status: 'error',
                msg: err.toString()
            });
        }
        res.json({
            status: 'success',
            order: order
        });
    });
});

module.exports = router;