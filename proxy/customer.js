/**
 * Created by Carlis on 4/11/15.
 */
var Customer = require('../models').Customer,
    utils = require('../utils/utils'),
    eventProxy = require('eventproxy');

exports.removeCustomerById = function (id, callback) {
    Customer.remove({id: id}, callback);
};

function findCustomerByName(name, callback) {
    if (!name) {
        return callback(new Error("Customer's name can not be empty."));
    }
    Customer.findOne({name: name}, function (err, customer) {
        callback(err, customer);
    });
}

exports.findCustomerByName = findCustomerByName;

exports.addCustomer = function (customer, callback) {
    findCustomerByName(customer.name, function (err, foundCustomer) {
        if (err) {
            return callback(err);
        }
        if (foundCustomer) {
            return callback(new Error('Customer already exist'));
        }
        var customer2Save = new Customer();
        customer2Save.id = utils.genId('C');
        utils.copyProperties(customer2Save, customer, ['name', 'tel', 'address']);
        customer2Save.save(function (err) {
            if (err) {
                return callback(err);
            }
            customer.id = customer2Save.id;
            callback(null, customer);
        });
    });
};

exports.updateCustomerById = function (customer, callback) {
    Customer.update({id: customer.id}, {$set: {
        name: customer.name,
        tel: customer.tel,
        address: customer.address
    }}, callback);
};

function findAllCustomers(callback) {
    Customer.find().sort({create_at: -1}).exec(callback);
}

exports.findAllCustomers = findAllCustomers;

exports.findCustomerByPagination = function(currentPage, pageSize, callback){
    var proxy = new eventProxy();
    proxy.assign('customer', 'total', function(customers, total){
        callback(null, customers, total);
    });
    Customer.find().sort({'create_at': -1}).skip((currentPage - 1) * pageSize).limit(pageSize).exec(proxy.done('customer'));
    Customer.count(proxy.done('total'));
}

exports.findCustomerById = function (id, callback) {
    Customer.findOne({id: id }, callback);
};