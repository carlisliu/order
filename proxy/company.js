/**
 * Created by Carlis on 5/4/15.
 */

var Company = require('../models').Company;

function find(callback) {
    Company.findOne(callback);
}

exports.getCompany = find;

exports.saveOrUpdate = function (company, callback) {
    if (!company || (!company.name && !company.address && ! company.phone)) {
        return Company.remove(callback);
    }
    find(function (err, old) {
        var shop;
        if (err) {
            return callback(err);
        }
        if (!old) {
            shop = new Company();
            shop.name = company.name;
            shop.address = company.address;
            shop.phone = company.phone;
            shop.save(function (err) {
                callback(err, company);
            });
        } else {
            Company.update({_id: old._id}, {'$set': {
                name: company.name,
                address: company.address,
                phone: company.phone
            }}, function (err) {
                callback(err, company);
            });
        }
    });
}