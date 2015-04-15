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
    var proxy = new EventProxy();
    proxy.assign('category_found', 'product_found', function (categories, products) {
        var msg = null;
        if(!categories || !categories.length){
            msg =  'No category found. Please click Category link on the left to add some categories first.'
        }
        res.render('product', {title: 'Product', category: categories, product: products, msg: msg});
    });
    Category.getAllCategory(proxy.done('category_found'));
    Product.findAllProducts(proxy.done('product_found'));
});

router.post('/add.html', function (req, res) {
    var product = req.param('product');
    if (product) {
        Product.saveProduct(product, function (err, product) {
            if (err) {
                res.json({status: 'error', msg: err.toString()});
            } else {
                res.json({status: 'success', msg: 'Saved'});
            }
        });
    } else {
        res.json({status: 'error', msg: 'Product can not be empty.'});
    }
});

router.get('/find.html/:id', function (req, res) {
    var categoryId = req.param('id');
    if (categoryId) {
        Product.getProductsByCategoryId(categoryId, function (err, products) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            res.json({status: 'success', products: products});
        });
    } else {
        res.json({status: 'error', msg: 'Category can not be empty.'});
    }
});

module.exports = router;