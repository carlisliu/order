/**
 * Created by Carlis on 4/11/15.
 */
var Customer = require('../models').Customer,
    utils = require('../utils/utils');

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

exports.findAllCustomers = function (callback) {
    Customer.find().sort({create_at: -1}).exec(callback);
};

exports.findCustomerById = function (id, callback) {
    Customer.find({id: id }, callback);
};