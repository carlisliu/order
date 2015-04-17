/**
 * Created by Carlis on 4/8/15.
 */

var Category = require('../models').Category,
    utils = require('../utils/utils');

exports.getAllCategory = function (callback) {
    Category.find(callback);
};

function findCategoryByName(name, callback) {
    if (!name) {
        return callback(new Error("Category's name can not be empty."));
    }
    Category.findOne({name: name}, function (err, category) {
        callback(err, category);
    });
}

exports.addCategory = function (category, callback) {
    if (category) {
        findCategoryByName(category.name, function (err, foundCategory) {
            if (err) {
                return callback(err);
            }
            if (foundCategory) {
                return callback(new Error('Category already existed.'))
            }
            var category2Save = new Category();
            category2Save.id = utils.genId('CA');
            utils.copyProperties(category2Save, category, ['name', 'memo']);
            category2Save.save(function (err) {
                category.id = category2Save.id;
                callback(err, category);
            });
        });
    } else {
        callback(new Error('Category item can not be empty.'));
    }
};

exports.removeCategoryById = function (id, callback) {
    Category.remove({id: id}, callback);
};

exports.updateCategory = function (category, callback) {
    if (category) {
        Category.update({id: category.id}, {$set: {name: category.name, memo: category.memo}}, function (err) {
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