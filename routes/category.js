/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Category = require('../proxy').Category;
var Product = require('../proxy').Product;
var utils = require('../utils/utils');
var EventProxy = require('eventproxy');

router.get('/index.html', function (req, res) {
    Category.getAllCategory(function (err, categories) {
        if (err) {
            categories = [];
        }
        res.render('category', {title: 'Category', category: categories})
    });
});

router.post('/add.html', function (req, res) {
    var category = req.param('category');
    Category.addCategory(category, function (err, category) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({msg: 'success', category: category});
        }
    });
});

router.post('/update.html', function (req, res) {
    var category = req.param('category');
    Category.updateCategory(category, function (err, category) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({status: 'success', msg: 'Removed'});
        }
    });
});

router.post('/remove.html', function (req, res) {
    var id = req.param('id');
    var proxy = new EventProxy();
    proxy.assign('category_removed', 'product_removed', function () {
        res.json({msg: 'Removed', status: 'success'});
    });
    Category.removeCategoryById(id, function (err) {
        if (err) {
            return res.json({status: 'error', msg: err.toString()});
        }
        proxy.done('category_removed')();
    });
    Product.removeProductsByCategoryId(id, function (err) {
        if (err) {
            return res.json({status: 'error', msg: err.toString()});
        }
        proxy.done('product_removed')();
    });
});

module.exports = router;