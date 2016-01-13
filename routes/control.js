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
	Company.findCompanies(null, res.handler(res, function(companies) {
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
				action['product'](source, destination, callback);
			}
		}], function(error, result) {
			if (error) {
				return res.json({

					status: 'error',
					message: error.message
				});
			}
			return res.json({
				status: 'success',
				message: 'done'
			});
		});
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
			ep.emit('delete', customers);
		}).bind('delete', function(customers) {
			var _customers = customers.map(function(customer) {
				return customer.name;
			});
			Customer.removeOneCustomer({
				name: {
					$in: _customers
				},
				company_id: destination
			}, function(error) {
				if (error) {
					return ep.emit('error', error);
				}
				ep.emit('insert', customers);
			});
		}).bind('insert', function(customers) {
			ep.after('batch', customers.length, function() {
				callback(null);
			});
			customers.forEach(function(customer) {
				customer = {
					name: customer.name,
					tel: customer.tel,
					address: customer.address,
					company_id: destination
				};
				Customer.addCustomer(customer, function(error) {
					if (error) {
						return ep.emit('error', error);
					}
					ep.emit('batch');
				});
			});
		}).fail(function(error) {
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
			ep.emit('delete', categories);
		}).bind('delete', function(categories) {
			var _categories = categories.map(function(customer) {
				return customer.name;
			});
			Category.removeOneCategory({
				name: {
					$in: _categories
				},
				company_id: destination
			}, function(error) {
				if (error) {
					return ep.emit('error', error);
				}
				console.log('deleted......');
				ep.emit('insert', categories);
			});
		}).bind('insert', function(categories) {
			ep.after('batch', categories.length, function() {
				console.log('done');
				callback(null);
			});
			categories.forEach(function(category) {
				category = {
					name: category.name,
					memo: category.memo,
					id: category.id,
					company_id: destination
				};
				console.log('add start');
				Category.saveCategory(category, function(error, category) {
					if (error) {
						return ep.emit('error', error);
					}
					console.log('added' + category.name + '.....');
					ep.emit('batch');
				});
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
			Category.findCategories({
				company_id: source
			}, function(error, categories) {
				if (!error && !categories.length) {
					error = failObject('categorySourceEmpty');
				}
				callback(error, categories);
			});
		}, function(categories, callback) {
			var _categories = categories.map(function (category) {
				return category.name;
			});
			Category.removeOneCategory({
				name: {$in: _categories},
				company_id: destination
			}, function (error) {
				category(error, categories);
			});
		}, function (categories, callback) {
			var ep = new EventProxy();
			ep.after('batch', categories.length, function () {
				callback();
			});
			ep.on('error', function (error) {
				callback(error);
			})
			categories.forEach(function (category) {
				category = {
					id: category.id,
					name: category.name,
					memo: category.memo,
					company_id: destination
				};
				Category.saveCategory(category, function(error, category) {
					if (error) {
						return ep.emit('error', error);
					}
					console.log('added' + category.name + '.....');
					ep.emit('batch');
				});
			});
		}, function (callback) {
			Product.findProducts({
				company_id: source
			}, callback);
		}, function (products, callback) {
			var _products = products.map(function(product) {
				return product.name;
			});
			Product.removeProducts({
				name: {
					$in: _products
				},
				company_id: destination
			}, function(error) {
				callback(error, products);
			});
		}, function (products, callback) {
			var ep = new EventProxy();
			ep.after('batch', products.length, function () {
				callback();
			});
			ep.on('error', function (error) {
				callback(error);
			})
			products.forEach(function (product) {
				product = {
					name: product.name,
					memo: product.memo,
					category_id: product.category_id,
					price: product.price,
					picture_uri: product.picture_uri,
					company_id: destination
				};
				Product.saveProductItem(product, function(error, product) {
					if (error) {
						return ep.emit('error', error);
					}
					console.log('added' + product.name + '.....');
					ep.emit('batch');
				});
			});
		}], function(error, result) {
			callback(error);
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