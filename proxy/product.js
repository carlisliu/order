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

exports.saveProduct = function (product, callback) {
    var product2Save;
    if (product) {
        product2Save = new Product();
        product2Save.id = utils.genId('P');
        utils.extend(product2Save, product);
        product2Save.save(function (err) {
            if (err) {
                return callback(err, null);
            }
            callback(null, product2Save);
        });
    }
};

exports.getProductById = getProductById;

exports.updateProduct = function (updProduct, callback) {
    getProductById(updProduct.id, function (err, product) {
        if (err) {
            return callback(err);
        }
        utils.extend(product, updProduct, ['name', 'price', 'memo', 'category_id']);
        product.update(function (err) {
            callback(err, product);
        });
    });
}