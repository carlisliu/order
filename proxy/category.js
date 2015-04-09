/**
 * Created by Carlis on 4/8/15.
 */

var Category = require('../models').Category,
    utils = require('../utils/utils');

exports.getAllCategory = function (callback) {
    Category.find(callback);
};

exports.addCategory = function (category, callback) {
    if (category) {
        var category2Save = new Category();
        category2Save.id = utils.genId('C');
        utils.extend(category2Save, category);
        category2Save.save(function (err) {
            callback(err, category2Save);
        })
    } else {
        callback(new Error('Category item can not be empty.'));
    }
};

exports.updateCategory = function (category, callback) {
    if (name) {
        Category.update({id: category.id}, {$set: {name: category.name, memo: category.momo}}, function (err) {
            callback(err, category);
        });
    } else {
        callback(new Error('Category item can not be empty.'));
    }
}

exports.getCategoryById = function (id, callback) {
    if (id) {
        Category.findOne({id: id}, function (err, category) {
            category(err, category);
        });
    } else {
        callback(new Error('Category id can not be empty.'));
    }
};