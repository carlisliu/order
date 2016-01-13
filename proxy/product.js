/**
 * Created by Carlis on 4/8/15.
 */

var Product = require('../models').Product;
var _ = require('lodash');

exports.saveProduct = function(product, callback) {
    if (product) {
        findOneProduct({
            category_id: product.category_id,
            name: product.name,
            company_id: product.company_id
        }, function(err, foundProduct) {
            if (err) {
                return callback(err);
            }
            if (foundProduct) {
                return callback(new Error('Product already exited at the same category.'));
            }
            var product2Save = new Product();
            _.assign(product2Save, product);
            product2Save.save(function(err) {
                product.id = product2Save.id;
                callback(err, product);
            });
        });
    } else {
        callback(new Error('Product can not be empty.'));
    }
};

exports.saveProductItem = function(product, callback) {
    var _product = new Product();
    _.assign(_product, product);
    _product.save(function(error) {
        callback(error, _product);
    });
};

exports.updateProduct = function(product, callback) {
    if (product) {
        Product.update({
            _id: product.id
        }, {
            $set: {
                name: product.name,
                memo: product.memo,
                price: product.price,
                category_id: product.category_id
            }
        }, function (error, product) {
            callback(error, product);
        });
    } else {
        callback(new Error('Product item can not be empty.'));
    }
};

exports.upsertProduct = function(condition, updateProp, callback) {
    Product.update(condition, {
        memo: product.memo,
        price: product.price,
        category_id: product.category_id,
        picture_uri: product.picture_uri
    }, {
        upsert: true
    }, callback);
};

function findOneProduct(params, callback) {
    Product.findOne(params, callback);
}

exports.findOneProduct = findOneProduct;

exports.findProducts = function(params, callback) {
    Product.find(params, callback);
}

exports.removeProducts = function(params, callback) {
    Product.remove(params, callback);
}