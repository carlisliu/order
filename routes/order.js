/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Order = require('../proxy').Order;
var Customer = require('../proxy').Customer;

router.get('/details/:id', function (req, res) {
    var orderId = req.params['id'];
    console.log(orderId);
    Order.getOrderById(orderId, function (err, order) {
        var msg = err ? err.toString() : '';
        res.render('order_detail', {order: order, msg: msg});
    });
});

router.get('/index.html', function (req, res) {
    Customer.findAllCustomers(function (err, customers) {
        res.render('order', {title: 'Order', customer: customers});
    });
});

module.exports = router;