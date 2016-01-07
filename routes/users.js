var express = require('express');
var crypto = require('crypto');
var async = require('async');
var router = express.Router();
var User = require('../proxy').User;
var Company = require('../proxy').Company;

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

function failObject(code) {
	var error = new Error(code);
	error.bizError = true;
	return error;
}

router.get('/index', function(req, res) {
	res.render('user');
});

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
	async.waterfall([function(callback) {
		User.findUserById(user.id, function(error, _user) {
			if (error) {
				return callback(error, null);
			}
			if (!_user) {
				return callback(failObject('notExist'), _user);
			}
			if (_user.password !== md5(user.password)) {
				return callback(failObject('pswIncorrect'), _user);
			}
			req.session.user = {
				id: _user.id,
				name: _user.name,
				password: _user.password,
				admin: _user.admin
			};
			return callback(error, _user.company_id);
		});
	}, function(companyId, callback) {
		Company.findCompanyById(companyId, function(error, company) {
			return callback(error, company);
		});
	}], function(error, company) {
		if (error) {
			if (error.bizError) {
				return res.render('login', message(error.message));
			}
			return res.render('login', message('unknown'));
		}
		if (company) {
			req.session.user.company = {
				id: company._id,
				name: company.name,
				address: company.address,
				phone: company.phone
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