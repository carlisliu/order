/**
 * Created by Carlis on 4/10/15.
 */
var express = require('express');
var router = express.Router();
var Customer = require('../proxy').Customer;
var utils = require('../utils/utils');
var config = require('../config');
var async = require('async');

var errorMessage = {
    'incomplete': 'Customer info is incomplete.',
    'existed': 'Customer already existed'
};

function failObject(code) {
    var error = new Error(errorMessage[code] || 'Error');
    error.bizError = true;
    return error;
}

router.get('/index.html', function(req, res) {
    var currentPage = req.query.page || 1,
        pageSize = config.page.pageSize;
    currentPage = parseInt(currentPage);
    Customer.findCustomerByPagination(currentPage, pageSize, {
        company_id: req.session.user.company.id
    }, function(err, customers, total) {
        customers = err ? [] : customers;
        if (customers.length) {
            customers.forEach(function(customer) {
                var address = customer.address;
                customer.address = JSON.stringify(address);
                customer.fixAddress = utils.fixAddress(customer.address);
            });
        }
        var startIndex = (currentPage - 1) * pageSize + 1;
        var endIndex = (currentPage * pageSize + pageSize) > total ? total : (currentPage * pageSize + pageSize);
        if (startIndex > endIndex) {
            startIndex = 0;
        }
        res.render('customer', {
            title: 'Customer',
            customers: customers,
            startIndex: startIndex,
            endIndex: endIndex,
            total: total
        });
    });
});

router.get('/details/:id', function(req, res) {
    var id = req.param('id');
    if (id) {
        return Customer.findOneCustomer({
            _id: id
        }, res.handler(function(customer) {
            res.json({
                status: 'success',
                customer: customer
            });
        }));
    }
    res.handler(failObject('incomplete'));
});

router.post('/add.html', function(req, res) {
    var customer = req.param('customer');
    if (customer) {
        customer.company_id = req.session.user.company.id;
        return Customer.addCustomer(customer, res.handler(function(customer) {
            res.json({
                msg: 'success',
                customer: customer
            });
        }));
    }
    res.handler(failObject('incomplete'));
});

router.post('/update.html', function(req, res) {
    var customer = req.param('customer');
    if (!customer) {
        return res.handler(failObject('incomplete'));
    }
    var companyId = req.session.user.company.id;
    async.waterfall([function(callback) {
        Customer.findOneCustomer({
            name: customer.name,
            company_id: companyId
        }, function(error, customer) {
            callback(error, customer);
        });
    }, function(_customer, callback) {
        if (_customer && _customer._id.toString() !== customer.id) {
            return callback(failObject('existed'));
        }
        customer.company_id = companyId;
        Customer.updateCustomerById(customer, function(error) {
            callback(error);
        });
    }], res.handler(function() {
        res.json({
            msg: 'Updated',
            status: 'success'
        });
    }));
});

router.post('/remove.html', function(req, res) {
    var id = req.param('id');
    if (!id) {
        return res.handler(failObject('incomplete'));
    }
    Customer.removeOneCustomer({
        _id: id
    }, res.handler(function() {
        res.json({
            status: 'success',
            msg: 'Removed'
        });
    }));
});

router.get('/get.html', function(req, res) {
    Customer.findCustomers({
        company_id: req.session.user.company.id
    }, function(err, customers) {
        var resCustomer = {};
        if (!err && customers) {
            customers.forEach(function(content) {
                resCustomer[content.id] = content.name;
            });
        }
        res.json({
            customer: resCustomer
        });
    });
});

module.exports = router;