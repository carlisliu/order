/**
 * Created by Carlis on 4/12/15.
 */
var express = require('express');
var router = express.Router();
var Category = require('../proxy').Category;
var utils = require('../utils/utils');

router.get('/index.html', function (req, res) {
    res.render('category', {title: 'Category'})
});

router.post('/add.html', function (req, res) {
    var category = req.param('category');
    console.log(category);
    Category.addCategory(category, function (err, category) {
        if (err) {
            res.json({msg: err.toString()});
        } else {
            res.json({msg: 'success', category: category});
        }
    });
});

module.exports = router;