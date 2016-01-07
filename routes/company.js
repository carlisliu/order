/**
 * Created by Carlis on 5/4/15.
 */

var express = require('express');
var router = express.Router();
var Company = require('../proxy').Company;
var User = require('../proxy').User;
var async = require('async');

router.get('/get.html', function(req, res) {
    var company = req.session.user.company;
    if (!company) {
        return res.json({
            company: {}
        });
    }
    Company.findCompanyById(company.id, function(err, company) {
        var data = {};
        if (err) {
            data.error = err.toString();
        }
        company = company || {};
        data.company = company;
        res.json(data);
    });
});

router.post('/save.html', function(req, res) {
    var company = req.param('company');
    var session = req.session;
    company._id = session.user.company ? session.user.company.id : '';
    async.waterfall([function(callback) {
        Company.saveOrUpdate(company, function(error, company) {
            var _company = {
                id: company._id,
                name: company.name,
                address: company.address,
                phone: company.phone
            };
            session.user.company = _company;
            callback(error, _company);
        });
    }, function(company, callback) {
        var user = req.session.user;
        User.updateUser(user.id, {
            company_id: company.id
        }, function(error) {
            if (!error) {
                req.session.user.companyId = company.id;
            }
            callback(error, company);
        });
    }], function(error, company) {
        res.json({
            error: error,
            company: company
        });
    });
});

module.exports = router;