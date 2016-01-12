/**
 * Created by Carlis on 4/8/15.
 */

var Product = require('../models').Product;
var utils = require('../utils/utils');

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
            product2Save.id = utils.genId('P');
            utils.copyProperties(product2Save, product, ['category_id', 'company_id', 'name', 'price', 'memo']);
            product2Save.save(function(err) {
                product.id = product2Save.id;
                callback(err, product);
            });
        });
    } else {
        callback(new Error('Product can not be empty.'));
    }
};

exports.updateProduct = function(product, callback) {
    if (product) {
        Product.update({
            id: product.id,
            company_id: product.company_id
        }, {
            $set: {
                name: product.name,
                memo: product.memo,
                price: product.price,
                category_id: product.category_id
            }
        }, callback);
    } else {
        callback(new Error('Product item can not be empty.'));
    }
};

exports.upsertProduct = function(condition, updateProp, options, callback) {
    Product.update(condition, updateProp, options, callback);
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