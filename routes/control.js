var express = require('express');
var router = express.Router();
var Company = require('../proxy').Company;
var Category = require('../proxy').Category;
var Product = require('../proxy').Product;
var Customer = require('../proxy').Customer;
var async = require('async');
var EventProxy = require('eventproxy');

router.get('/index.html', function(req, res) {
	var exportTargets = ['Category', 'Product', 'Customer'];
	Company.findCompanies(null, res.handler(function(companies) {
		res.render('control', {
			companies: companies,
			exportTarget: exportTargets
		});
	}));
});

router.post('/table.html', function(req, res) {
	var table = req.param('table');
	var source = req.param('source');
	var destination = req.param('destination');
	if (table && source && destination && (destination !== source)) {
		return async.waterfall([function(callback) {
			Company.findCompanies({
				_id: {
					'$in': [source, destination]
				}
			}, function(error, companies) {
				if (!error && (companies.length !== 2)) {
					error = failObject('wrongInfo');
				}
				callback(error, companies);
			});
		}, function(companies, callback) {
			if (typeof table === 'string') {
				action[table.toLowerCase()](source, destination, callback);
			} else {
				Product.findProducts({
					company_id: source
				}, function(error, products) {
					if (error || !products || !products.length) {
						action['category'](source, destination, callback);
					} else {
						action['product'](source, destination, callback);
					}
				});
			}
		}], res.handler(function() {
			return res.json({
				status: 'success',
				message: 'Finished'
			});
		}));
	}
	return res.json({
		status: 'error',
		message: 'Table info is imcomplete.'
	});
});

var action = {
	customer: function(source, destination, callback) {
		var ep = new EventProxy();
		ep.bind('customer', function(customers) {
			if (!customers || !customers.length) {
				return ep.emit('error', new Error('Source does not contain any customer data, no need to export/import.'));
			}
			ep.emit('upsert', customers);
		}).bind('upsert', function(customers) {
			ep.after('batch', customers.length, function() {
				callback(null);
			});
			customers.forEach(function(customer) {
				Customer.upsertCustomer({
					name: customer.name,
					company_id: destination
				}, customer, ep.done('batch'));
			});
		}).on('error', function(error) {
			callback(error);
		});
		return Customer.findCustomers({
			company_id: source
		}, ep.done('customer'));
	},
	category: function(source, destination, callback) {
		var ep = new EventProxy();
		ep.bind('category', function(categories) {
			if (!categories || !categories.length) {
				return ep.emit('error', new Error('Source does not contain any category data, no need to export/import.'));
			}
			console.log(categories);
			ep.emit('upsert', categories);
		}).bind('upsert', function(categories) {
			ep.after('batch', categories.length, function() {
				console.log('done');
				callback(null);
			});
			categories.forEach(function(category) {
				Category.upsertCategory({
					name: category.name,
					company_id: destination
				}, category, ep.done('batch'));
			});
		}).fail(function(error) {
			callback(error);
		});
		return Category.findCategories({
			company_id: source
		}, ep.done('category'));
	},
	product: function(source, destination, callback) {
		async.waterfall([function(callback) {
			async.parallel([
					function(_callback) {
						Category.findCategories({
							company_id: source
						}, _callback);
					},
					function(_callback) {
						Product.findProducts({
							company_id: source
						}, _callback);
					}
				],
				function(error, results) {
					var categories = results[0];
					var products = results[1];
					var categoryName = {};
					categories && categories.forEach(function(category) {
						categoryName[category._id] = category.name;
					});
					products && products.forEach(function(product) {
						product.category_name = categoryName[product.category_id] || null;
					});
					console.log( categories, products);
					callback(error, categories, products);
				});
		}, function(categories, products, callback) {
			var ep = new EventProxy();
			if (categories && categories.length) {
				ep.after('batch', categories.length, function() {
					console.log( 'batch Finished');
					callback(null, products);
				}).on('error', callback);
				categories.forEach(function(category) {
					Category.upsertCategory({
						name: category.name,
						company_id: destination
					}, category, ep.done('batch'));
				});
			} else {
				callback(null, products);
			}
		}, function(products, callback) {
			Category.findCategories({
				company_id: source
			}, function(error, categories) {
				console.log( categories);
				var categoryName = {};
				categories && categories.forEach(function(category) {
					categoryName[category.name] = category._id;
				});
				callback(error, categoryName, products);
			});
		}, function(categoryName, products, callback) {
			if (products && products.length) {
				var ep = new EventProxy();
				ep.after('batch', products.length, function() {
					console.log( 'product batch Finished');
					callback();
				}).on('error', callback);
				products.forEach(function(product) {
					product.category_id = categoryName[product.category_name];
					Product.upsertProduct({
						name: product.name,
						company_id: destination
					}, product, ep.done('batch'));
				});
			} else {
				callback();
			}
		}], function(error, result) {
			console.log(error);
			callback(error, result);
		});
	}
};

var msg = {
	wrongInfo: 'Company info is incorrect!',
	categorySourceEmpty: 'Source does not contain any category data, no need to export/import.'
};

function failObject(code) {
	var error = new Error(msg[code] || 'Error');
	error.bizError = true;
	return error;
}

module.exports = router;