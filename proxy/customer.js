/**
 * Created by Carlis on 4/11/15.
 */
var Customer = require('../models').Customer,
    utils = require('../utils/utils'),
    eventProxy = require('eventproxy');

exports.removeCustomerById = function(id, callback) {
    Customer.remove({
        id: id
    }, callback);
};

function findCustomerByName(name, callback) {
    if (!name) {
        return callback(new Error("Customer's name can not be empty."));
    }
    Customer.findOne({
        name: name
    }, function(err, customer) {
        callback(err, customer);
    });
}

exports.findCustomerByName = findCustomerByName;

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
        customer2Save.id = utils.genId('C');
        utils.copyProperties(customer2Save, customer, ['name', 'company_id', 'tel', 'address']);
        customer2Save.save(function(err) {
            if (err) {
                return callback(err);
            }
            customer.id = customer2Save.id;
            callback(null, customer);
        });
    });
};

exports.updateCustomerById = function(customer, callback) {
    Customer.update({
        id: customer.id,
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

exports.findCustomerById = function(id, callback) {
    Customer.findOne({
        id: id
    }, callback);
};

exports.findCustomers = function(params, callback) {
    Customer.find(params, callback);
};

exports.removeOneCustomer = function(params, callback) {
    Customer.remove(params, callback);
};

exports.updateCompany = function(condition, updateProp, options, callback) {
    Customer.update(condition, updateProp, options, callback);
}