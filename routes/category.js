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
var failObject = require('./util').failObject('category');

router.get('/index.html', function(req, res) {
    var proxy = new EventProxy();
    proxy.assign('category', 'total', function(categories, total) {
        res.render('category', {
            title: 'Category',
            category: categories,
            total: total
        });
    });
    var param = {
        company_id: req.session.user.company.id
    }
    Category.findCategories(param, proxy.done('category'));
    Category.getTotal(param, proxy.done('total'));
});

router.post('/add.html', function(req, res) {
    var category = req.param('category');
    if (category) {
        category.company_id = req.session.user.company.id;
        var ep = new EventProxy();
        return ep.asap('check', function() {
            Category.findOneCategory({
                name: category.name,
                company_id: req.session.user.company.id
            }, ep.done('pass'));
        }).on('pass', function(_category) {
            if (_category) {
                return ep.emit('error', failObject('existed'));
            }
            Category.saveCategory(category, ep.done('saved'));
        }).on('saved', function(category) {
            res.json({
                msg: 'success',
                category: category
            });
        }).on('error', res.handler());
    }
    res.handler(failObject('incomplete'));
});

router.post('/update.html', function(req, res) {
    var category = req.param('category');
    if (category) {
        var companyId = req.session.user.company.id;
        var ep = new EventProxy();
        return ep.asap('check', function() {
            Category.findOneCategory({
                name: category.name,
                company_id: companyId
            }, ep.done('update'));
        }).on('update', function(_category) {
            if (_category && _category._id.toString() !== category._id) {
                return ep.emit('error', failObject('existed'));
            }
            category.company_id = companyId;
            Category.updateCategory(category, ep.done('finish'));
        }).on('finish', function() {
            res.json({
                status: 'success',
                msg: 'Updated'
            });
        }).on('error', res.handler());
    }
    res.handler(failObject('incomplete'));
});

router.post('/remove.html', function(req, res) {
    var id = req.param('id');
    if (!id) {
        return res.handler(new Error('Category info is incomplete.'));
    }
    var companyId = req.session.user.company.id;
    async.series([function(callback) {
        Category.removeOneCategory({
            _id: id
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
    }], res.handler(function(results) {
        res.json({
            msg: 'Removed',
            status: 'success'
        });
    }));
});

module.exports = router;