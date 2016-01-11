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
			action.customer(source, destination, callback);
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
		ep.assign('customer', function(customers) {
			if (!customers || !customers.length) {
				return callback(new Error('Source does not contain any customer data'));
			}
			ep.after('updated', customers.length, function() {
				callback();
			});
			customers.forEach(function(customer) {
				Customer.updateCompany({
					id: customer.id
				}, {
					'$set': {
						name: customer.name,
						tel: customer.tel,
						company_id: destination,
						address: customer.address
					}
				}, {
					upsert: true
				}, ep.done('updated'));
			});
		});
		ep.fail(function(error) {
			callback(error);
		})
		return Customer.findCustomers({
			company_id: source
		}, ep.done('customer'));
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