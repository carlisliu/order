var express = require('express');
var router = express.Router();
var order = require('../api').order;

router.get('/order', function(req, res) {
	order.findAll(function(error, orders) {
		if (error) {
			return res.json({
				status: 'error',
				message: error.message || '',
				error: error
			});
		}
		res.json({
			status: 'success',
			message: 'query ok.',
			data: orders
		});
	});
});

router.get('/order/:id', function(req, res) {
	res.json({
		status: 'pending',
		message: 'not implemented yet.'
	});
});

module.exports = router;