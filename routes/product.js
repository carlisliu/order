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
        var msg = null, categoryName;
        if (!categories || !categories.length) {
            msg = 'No category found. Please click Category link on the left to add some categories first.'
        } else {
            categoryName = {};
            categories.forEach(function (content, index) {
                categoryName[content.id] = content.name;
            });
            if (products) {
                products.forEach(function (content, index) {
                    content.category_name = categoryName[content.category_id];
                });
            }
        }
        res.render('product', {title: 'Product', category: categories, product: products, msg: msg, categoryData: categoryName});
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

router.post('/update.html', function (req, res) {
    var product = req.param('product');
    if (product) {
        Product.updateProduct(product, function (err) {
            if (err) {
                res.json({status: 'error', msg: err.toString()});
            } else {
                Category.getAllCategory(function (err, categories) {
                    var categoryName;
                    if (err) {
                        res.json({status: 'error', msg: err.toString()});
                    } else {
                        if (categories) {
                            categories.forEach(function (content) {
                                if (content.id == product.category_id) {
                                    categoryName = content.name;
                                }
                            });
                        }
                        if (categoryName) {
                            product.category_name = categoryName;
                        }
                        res.json({status: 'success', msg: 'Updated', product: product});
                    }
                });
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

router.post('/remove.html', function (req, res) {
    var id = req.param('id');
    if (id) {
        Product.removeProductById(id, function (err) {
            if (err) {
                res.json({status: 'error', msg: err.toString()});
            } else {
                res.json({status: 'success', msg: 'Removed'});
            }
        });
    } else {
        res.json({status: 'error', msg: 'Product can not be empty.'});
    }
});

module.exports = router;