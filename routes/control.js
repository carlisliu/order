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
		async.waterfall([function(callback) {
			Company.findCompanies({
				id: {
					'$in': [source, destination]
				}
			}, function(error, companies) {
				if (!error && (companies !== 2)) {
					error = failObject('wrongInfo');
				}
				callback(error, companies);
			});
		}, function(companies, callback) {
			action[table.toLowerCase()](source, destination, callback);
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
		ep.asap('customer', function (customers) {
			if (!customers || !customers.length) {
				return ep.emit('error', new Error('Source does not contain any customer data, no need to export/import.'));
			}
			ep.emit('delete', customers);
		}).asap('delete', function (customers) {
			var _customers = customers.map(function (customer) {
				return customer.name;
			});
			Customer.removeOneCustomer({
				name : {
					$in: _customers
				},
				company_id: destination
			}, function (error) {
				if (error) {
					return ep.emit('error', error);
				}
				ep.emit('insert', customers);
			});
		}).asap('insert', function (customers) {
			ep.after('batch', customers.length, function () {
				callback(null);
			});
			customers.forEach(function (customer) {
				Customer.addCustomer(customer, function (error) {
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
		ep.assign('category', function(categories) {
			if (!categories || !categories.length) {
				return callback(new Error('Source does not contain any category data'));
			}
			ep.after('updated', categories.length, function() {
				callback(null);
			});
			categories.forEach(function(category) {
				Category.upsertCategory({
					id: category.id
				}, {
					'$set': {
						name: category.name,
						memo: category.memo,
						company_id: destination
					}
				}, {
					upsert: true
				}, ep.done('updated'));
			});
		});
		ep.fail(function(error) {
			callback(error);
		})
		return Category.findCategories({
			company_id: source
		}, ep.done('category'));
	},
	product: function(source, destination, callback) {
		var ep = new EventProxy();
		ep.assign('product', function(products) {
			if (!products || !products.length) {
				return callback(new Error('Source does not contain any product data'));
			}
			ep.after('updated', products.length, function() {
				callback(null);
			});
			products.forEach(function(product) {
				Products.upsertProduct({
					id: product.id
				}, {
					'$set': {
						name: product.name,
						memo: product.memo,
						category_id: product.category_id
						picture_uri: product.picture_uri,
						price: product.price,
						company_id: destination
					}
				}, {
					upsert: true
				}, ep.done('updated'));
			});
		});
		ep.fail(function(error) {
			callback(error);
		})
		return Product.findProducts({
			company_id: source
		}, ep.done('product'));
	}
};

var msg = {
	wrongInfo: 'Company info is incorrect!'
};

function failObject(code) {
	var error = new Error(msg[code] || 'Error');
	error.bizError = true;
	return error;
}

module.exports = router;