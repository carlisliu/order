/**
 * Created by Carlis on 4/8/15.
 */

var Category = require('../models').Category;
var _ = require('lodash');

exports.getAllCategory = function(callback) {
    Category.find(callback);
};

exports.saveCategory = function(category, callback) {
    var _category = new Category();
    _.assign(_category, category);
    _category.save(function(error) {
        callback(error, _category);
    });
};

exports.updateCategory = function(category, callback) {
    if (category) {
        Category.update({
            _id: category.id
                /*,
                            company_id: category.company_id*/
        }, {
            $set: {
                name: category.name,
                memo: category.memo
            }
        }, function(err) {
            callback(err, category);
        });
    } else {
        callback(new Error('Category item can not be empty.'));
    }
};
exports.upsertCategory = function(condition, updateProp, options, callback) {
    return Category.update(condition, updateProp, options, callback);
};

exports.getCategoryById = function(id, callback) {
    if (id) {
        Category.findOne({
            id: id
        }, function(err, category) {
            category(err, category);
        });
    } else {
        callback(new Error('Category id can not be empty.'));
    }
};

exports.getTotal = function(params, callback) {
    if (!callback) {
        callback = params;
        return Category.count(callback);
    }
    Category.count(params, callback);
};

function findOneCategory(params, callback) {
    Category.findOne(params, callback);
}

exports.findOneCategory = findOneCategory;

exports.findCategories = function(params, callback) {
    Category.find(params, callback);
};

exports.removeOneCategory = function(params, callback) {
    Category.remove(params, callback);
};