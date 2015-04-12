/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Order = require('../proxy').Order;

router.get('/:id', function (req, res) {
    var orderId = req.params['id'];
    Order.getOrderById(orderId, function (err, order) {
        var msg = err ? err.toString() : '';
        res.render('order_detail', {order: order, msg: msg});
    });
});

module.exports = router;