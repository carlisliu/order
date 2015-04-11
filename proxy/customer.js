/**
 * Created by Carlis on 4/11/15.
 */
var Customer = require('../models').Customer,
    utils = require('../utils/utils');

exports.removeCustomerById = function (id, callback) {
    Customer.remove({id: id}, callback);
};

exports.addCustomer = function (customer, callback) {
    var customer2Save = new Customer();
    utils.copyProperties(customer2Save, customer, ['name', 'tel', 'address']);
    customer2Save.save(function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, customer2Save);
    });
}

exports.findCustomerById = function (id, callback) {
    Customer.find({id: id }, callback);
};