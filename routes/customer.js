/**
 * Created by Carlis on 4/10/15.
 */
var express = require('express');
var router = express.Router();
var Customer = require('../proxy').Customer;
var utils = require('../utils/utils');

/* GET home page. */
router.get('/index.html', function (req, res) {
    Customer.findAllCustomers(function (err, customers) {
        customers = err ? [] : customers;
        if (customers.length) {
            customers.forEach(function (customer) {
                var address = customer.address;
                customer.address = JSON.stringify(address);
                customer.fixAddress = utils.fixAddress(customer.address);
            });
        }
        res.render('customer', { title: 'Customer', customers: customers });
    });
});

router.get('/details/:id', function (req, res) {
    var id = req.param('id');
    Customer.findCustomerById(id, function (err, customer) {
        var responseData = {};
        if (err) {
            responseData.status = 'error';
            responseData.msg = err.toString();
        } else {
            responseData.status = 'success';
            responseData.customer = customer;
        }
        res.json(responseData);
    });
})

router.post('/add.html', function (req, res) {
    var customer = req.param('customer');
    Customer.addCustomer(customer, function (err, customer) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({msg: 'success', customer: customer});
        }
    });
});

router.post('/remove.html', function (req, res) {
    var id = req.param('id');
    console.log(id);
    Customer.removeCustomerById(id, function (err) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({msg: 'Removed'});
        }
    });
});

module.exports = router;
