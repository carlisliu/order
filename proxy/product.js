/**
 * Created by Carlis on 4/8/15.
 */

var Product = require('../models').Product,
    utils = require('../utils/utils');

function getProductById(id, callback) {
    if (id) {
        Product.findOne({id: id}, callback);
    } else {
        callback(new Error('id can not be empty'), null);
    }
}

function findUniqueProduct(categoryId, name, callback) {
    if (!categoryId || !name) {
        return callback(new Error('Search condition is not complete.'));
    }
    Product.findOne({category_id: categoryId, name: name}, callback);
}

exports.findUniqueProduct = findUniqueProduct;

exports.saveProduct = function (product, callback) {
    if (product) {
        findUniqueProduct(product.category_id, product.name, function (err, foundProduct) {
            if (err) {
                return callback(err);
            }
            if (foundProduct) {
                return callback(new Error('Product already exited at the same category.'));
            }
            var product2Save = new Product();
            product2Save.id = utils.genId('P');
            utils.copyProperties(product2Save, product, ['category_id', 'name', 'price', 'memo']);
            product2Save.save(function (err) {
                product.id = product2Save.id;
                callback(err, product);
            });
        });
    } else {
        callback(new Error('Product can not be empty.'));
    }
};

exports.removeProductById = function (id, callback) {
    Product.remove({id: id}, callback);
};

exports.getProductById = getProductById;

exports.updateProduct = function (updProduct, callback) {
    getProductById(updProduct.id, function (err, product) {
        if (err) {
            return callback(err);
        }
        utils.copyProperties(product, updProduct, ['name', 'price', 'memo', 'category_id']);
        product.update(function (err) {
            callback(err, product);
        });
    });
}

exports.getProductsByCategoryId = function (categoryId, callback) {
    Product.find({category_id: categoryId}, callback);
};

exports.findAllProducts = function (callback) {
    Product.find(callback);
}