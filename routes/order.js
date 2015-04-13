/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Order = require('../proxy').Order;
var Customer = require('../proxy').Customer;
var Category = require('../proxy').Category;

router.get('/details/:id', function (req, res) {
    var orderId = req.params['id'];
    console.log(orderId);
    Order.getOrderById(orderId, function (err, order) {
        var msg = err ? err.toString() : '';
        if (!order) {
            msg = 'Order does not exist.';
        }
        res.render('order_detail', {order: order, msg: msg});
    });
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
            return res.json({status: 'error', msg: err.toString(), customer: customer});
        }
        res.json({status: 'success', order: order});
    });
});

module.exports = router;