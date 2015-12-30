var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../proxy').User;
var message = function(code) {
	var msg = {
		notExist: 'User does not exist!',
		pswIncorrect: 'Password incorrect!',
		notEmpty: 'User name or password can not be empty!'
	};
	return {
		message: msg[code] || 'Error'
	};
};

router.get('/login', function(req, res) {
	res.render('login');
});

router.post('/login', function(req, res) {
	var user = {
		id: req.param('form-username'),
		password: req.param('form-password')
	};
	if (!user.id || !user.password) {
		return res.render('login', message('notEmpty'));
	}
	User.findUserById(user.id, function(error, found) {
		if (error) {
			return res.render('login', message('unknown'));
		}
		if (!found) {
			return res.render('login', message('notExist'));
		}
		if (found.password !== md5(user.password)) {
			return res.render('login', message('pswIncorrect'));
		} else {
			req.session.user = {
				id: found.id,
				name: found.name,
				password: found.password
			};
		}
		return res.redirect('/');
	});
});

router.get('/logout', function(req, res) {
	if (req.session.user) {
		req.session.user = null;
	}
	return res.redirect('/users/login');
});

function md5(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}

module.exports = router;