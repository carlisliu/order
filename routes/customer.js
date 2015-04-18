/**
 * Created by Carlis on 4/10/15.
 */
var express = require('express');
var router = express.Router();
var Customer = require('../proxy').Customer;
var utils = require('../utils/utils');
var config = require('../config');

/* GET home page. */
router.get('/index.html', function (req, res) {
    var currentPage = req.query.page || 1, pageSize = config.page.pageSize;
    currentPage = parseInt(currentPage);
    Customer.findCustomerByPagination(currentPage, pageSize, function (err, customers, total) {
        customers = err ? [] : customers;
        if (customers.length) {
            customers.forEach(function (customer) {
                var address = customer.address;
                customer.address = JSON.stringify(address);
                customer.fixAddress = utils.fixAddress(customer.address);
            });
        }
        res.render('customer', {
            title: 'Customer',
            customers: customers,
            startIndex: (currentPage - 1) * pageSize + 1,
            endIndex: (currentPage * pageSize + pageSize) > total ? total : (currentPage * pageSize + pageSize),
            total: total
        });
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
});

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

router.post('/update.html', function (req, res) {
    var customer = req.param('customer');
    Customer.updateCustomerById(customer, function (err) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({msg: 'Updated', status: 'success'});
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

router.get('/get.html', function (req, res) {
    Customer.findAllCustomers(function (err, customers) {
        var resCustomer = {};
        if (!err && customers) {
            customers.forEach(function (content) {
                resCustomer[content.id] = content.name;
            });
        }
        res.json({customer: resCustomer});
    });
});

module.exports = router;
