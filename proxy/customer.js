/**
 * Created by Carlis on 4/11/15.
 */
var Customer = require('../models').Customer;
var eventProxy = require('eventproxy');
var _ = require('lodash');

exports.addCustomer = function(customer, callback) {
    findOneCustomer({
        name: customer.name,
        company_id: customer.company_id
    }, function(err, foundCustomer) {
        if (err) {
            return callback(err);
        }
        if (foundCustomer) {
            return callback(new Error('Customer already exist'));
        }
        var customer2Save = new Customer();
        _.assign(customer2Save, customer);
        customer2Save.save(function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, customer);
        });
    });
};

exports.updateCustomerById = function(customer, callback) {
    Customer.update({
        _id: customer.id,
        company_id: customer.company_id
    }, {
        $set: {
            name: customer.name,
            tel: customer.tel,
            address: customer.address
        }
    }, callback);
};

function findAllCustomers(callback) {
    Customer.find().sort({
        create_at: -1
    }).exec(callback);
}

exports.findAllCustomers = findAllCustomers;

exports.findCustomerByPagination = function(currentPage, pageSize, params, callback) {
    var proxy = new eventProxy();
    proxy.assign('customer', 'total', function(customers, total) {
        callback(null, customers, total);
    });
    Customer.find(params).sort({
        'create_at': -1
    }).skip((currentPage - 1) * pageSize).limit(pageSize).exec(proxy.done('customer'));
    Customer.count(params, proxy.done('total'));
}

function findOneCustomer(params, callback) {
    Customer.findOne(params, callback);
}

exports.findOneCustomer = findOneCustomer

exports.findCustomers = function(params, callback) {
    Customer.find(params, callback);
};

exports.removeOneCustomer = function(params, callback) {
    Customer.remove(params, callback);
};