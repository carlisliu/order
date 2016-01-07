/**
 * Created by Carlis on 5/4/15.
 */

var Company = require('../models').Company;
var util = require('../utils/utils');

function find(callback) {
    Company.findOne(callback);
}

exports.getCompany = find;

function create(company, callback) {
    delete company._id;
    var _company = new Company();
    util.extend(_company, company);
    return _company.save(function(err) {
        return callback(err, _company);
    });
}

exports.saveOrUpdate = function(company, callback) {
    if (!company._id) {
        return create(company, callback);
    }
    findCompanyById(company._id, function(error, old) {
        if (error || !old) {
            return create(company, callback);
        }
        Company.update({
            _id: old._id
        }, {
            '$set': {
                name: company.name,
                address: company.address,
                phone: company.phone
            }
        }, function(err) {
            callback(err, company);
        });
    });
}

function findCompanyById(id, callback) {
    return Company.findOne({
        _id: id
    }, callback);
}

exports.findCompanyById = findCompanyById;