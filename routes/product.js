/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Category = require('../proxy').Category;
var Product = require('../proxy').Product;
var utils = require('../utils/utils');

router.get('/index.html', function (req, res) {
    Category.getAllCategory(function (err, categories) {
        var msg = err ? err.toString() : (categories.length ? null : 'No category found. Please click Category link on the left to add some categories first.');
        categories = err ? [] : categories;
        console.log(categories);
        res.render('product', {title: 'Product', category: categories, msg: msg});
    });
})

module.exports = router;