var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title: 'Home'
	});
});

router.get('/remote.html', function(req, res) {
	remote(res);
});


function remote(streamObj, done) {
	var requestOptions = {
		method: 'GET',
		host: 'localorder.5lym.com',
		port: 3000,
		path: '/api/order'
	};
	var request = http.request(requestOptions);
	request.on('response', function(response) {
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