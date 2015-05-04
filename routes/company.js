/**
 * Created by Carlis on 5/4/15.
 */

var express = require('express');
var router = express.Router();
var Company = require('../proxy').Company;

router.get('/get.html', function (req, res) {
    Company.getCompany(function (err, company) {
        var data = {};
        if (err) {
            data.error = err.toString();
        }
        company = company || {};
        data.company = company;
        res.json(data);
    });
});

router.post('/save.html', function (req, res) {
    var company = req.param('company');
    Company.saveOrUpdate(company, function (err, company) {
        res.json({error: err, company: company});
    });
});

module.exports = router;