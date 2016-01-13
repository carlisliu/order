/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Category = require('../proxy').Category;
var Product = require('../proxy').Product;
var utils = require('../utils/utils');
var EventProxy = require('eventproxy');
var failObject = require('./util').failObject('product');

router.get('/index.html', function(req, res) {
    var proxy = new EventProxy();
    proxy.assign('categories', 'products', function(categories, products) {
        var msg = null,
            categoryName;
        if (!categories || !categories.length) {
            msg = 'No category found. Please click Category link on the left to add some categories first.'
        } else {
            categoryName = {};
            categories.forEach(function(content, index) {
                categoryName[content.id] = content.name;
            });
            if (products) {
                products.forEach(function(content, index) {
                    content.category_name = categoryName[content.category_id];
                });
            }
        }
        res.render('product', {
            title: 'Product',
            category: categories,
            product: products,
            msg: msg,
            categoryData: categoryName
        });
    });
    var param = {
        company_id: req.session.user.company.id
    };
    Category.findCategories(param, proxy.done('categories'));
    Product.findProducts(param, proxy.done('products'));
});

router.post('/add.html', function(req, res) {
    var product = req.param('product');
    if (product) {
        product.company_id = req.session.user.company.id;
        return Product.saveProduct(product, res.handler(function() {
            res.json({
                status: 'success',
                msg: 'Saved'
            });
        }));
    }
    res.handler(failObject('incomplete'));
});

router.post('/update.html', function(req, res) {
    var product = req.param('product');
    if (product) {
        var companyId = req.session.user.company.id;
        var ep = new EventProxy();
        return ep.asap('check', function() {
            Product.findOneProduct({
                name: product.name,
                company_id: companyId,
                category_id: product.category_id
            }, ep.done('update'));
        }).on('update', function(_product) {
            if (_product && _product._id.toString() !== product.id) {
                return ep.emit('error', failObject('duplicate'));
            }
            product.company_id = companyId;
            Product.updateProduct(product, ep.done('finish'));
            ep.emit('category');
        }).all('category', 'finish', function(categories, product) {
            var categoryName;
            if (categories) {
                categories.forEach(function(content) {
                    if (content.id == product.category_id) {
                        categoryName = content.name;
                    }
                });
            }
            if (categoryName) {
                product.category_name = categoryName;
            }
            res.json({
                status: 'success',
                msg: 'Updated',
                product: product
            });
        }).on('error', res.handler());
    }
    res.handler(failObject('incomplete'));
});

router.get('/find.html/:id', function(req, res) {
    var categoryId = req.param('id');
    if (categoryId) {
        return Product.findProducts({
            category_id: categoryId,
            company_id: req.session.user.company.id
        }, res.handler(function(products) {
            res.json({
                status: 'success',
                products: products
            });
        }));
    }
    res.handler(failObject('categoryIdEmpty'));
});

router.post('/remove.html', function(req, res) {
    var id = req.param('id');
    if (id) {
        return Product.removeProducts({
            _id: id
        }, res.handler(function() {
            res.json({
                status: 'success',
                msg: 'Removed'
            });
        }));
    }
    res.handler(failObject('incomplete'));
});

module.exports = router;