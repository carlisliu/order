var express = require('express');
var router = express.Router();
var http = require('http');
var Customer = require('../proxy').Customer;

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title: 'Home'
	});
});

router.get('/remote.html', function(req, res) {
	remote(res);
});

router.get('/remote-node.html', function(req, res) {
	Customer.findAllCustomers(function (error, customers) {
		console.log(customers);
		remote(res);
	});
});

router.get('/remote-order.html', function(req, res) {
	Customer.findAllCustomers(function (error, customers) {
		console.log(customers);
		remote(res);
	});
});

router.get('/remote-mysql.html', function(req, res) {
	res.setHeader("Content-Type", "application/json;charset=utf-8");
	Customer.findAllCustomers(function (error, customers) {
		console.log(customers);
		remote(res);
	});
});


function remote(streamObj, done) {
	var requestOptions = {
		method: 'GET',
		host: 'localorder.5lym.com',
		port: 7000,
		path: '/api/mysql'
	};
	var request = http.request(requestOptions);
	request.on('response', function(response) {
		response.setEncoding('utf8');
		response.pipe(streamObj);
		response.on('end', function(argument) {
			done && done();
		})
	});
	request.on('error', function(error) {
		console.error(error);
	});
	request.end();
}

module.exports = router;