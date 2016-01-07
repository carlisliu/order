/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Category = require('../proxy').Category;
var Product = require('../proxy').Product;
var utils = require('../utils/utils');
var EventProxy = require('eventproxy');
var async = require('async');

router.get('/index.html', function(req, res) {
    var proxy = new EventProxy();
    proxy.assign('category_found', 'total_found', function(categories, total) {
        res.render('category', {
            title: 'Category',
            category: categories,
            total: total
        });
    });
    var param = {
        company_id: req.session.user.company.id
    }
    Category.findCategories(param, proxy.done('category_found'));
    Category.getTotal(param, proxy.done('total_found'));
});

router.post('/add.html', function(req, res) {
    var category = req.param('category');
    if (category) {
        category.company_id = req.session.user.company.id;
    }
    Category.addCategory(category, function(err, category) {
        if (err) {
            res.json({
                msg: err.toString()
            });
        } else {
            res.json({
                msg: 'success',
                category: category
            });
        }
    });
});

router.post('/update.html', function(req, res) {
    var category = req.param('category');
    if (category) {
        category.company_id = req.session.user.company.id;
    }
    Category.updateCategory(category, function(err, category) {
        if (err) {
            res.json({
                msg: err.toString()
            });
        } else {
            res.json({
                status: 'success',
                msg: 'Updated'
            });
        }
    });
});

router.post('/remove.html', function(req, res) {
    var id = req.param('id');
    var companyId = req.session.user.company.id;
    async.series([function(callback) {
        Category.removeOneCategory({
            id: id,
            company_id: companyId
        }, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(err, 'Category Removed');
        });
    }, function(callback) {
        Product.removeProducts({
            category_id: id,
            company_id: companyId
        }, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(err, 'Product Removed');
        });
    }], function(error, results) {
        if (error) {
            return res.json({
                msg: error.message || 'Error',
                status: 'error'
            });
        }
        res.json({
            msg: 'Removed',
            status: 'success'
        });
    });
});

module.exports = router;