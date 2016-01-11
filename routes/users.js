var express = require('express');
var crypto = require('crypto');
var async = require('async');
var router = express.Router();
var User = require('../proxy').User;
var Company = require('../proxy').Company;
var EventProxy = require('eventproxy');
var _ = require('lodash');

var msg = {
	notExist: 'User does not exist!',
	pswNotIdentical: 'Passwords are not identical, Please try again.',
	pswIncorrect: 'Password incorrect!',
	notEmpty: 'User name or password can not be empty!',
	alreadyExist: 'User already exists.'
};

var message = function(code) {
	return {
		status: 'error',
		message: msg[code] || 'Error'
	};
};

function failObject(code) {
	var error = new Error(msg[code] || 'Error');
	error.bizError = true;
	return error;
}

function handler(res, callback) {
	return function(error, results) {
		if (error) {
			return res.json({
				status: 'error',
				msg: error.message || 'Error'
			});
		}
		callback(results);
	};
}

router.get('/index.html', function(req, res, next) {
	var ep = new EventProxy();
	ep.fail(function(error) {
		next();
	});
	ep.assign('companies', 'users', function(companies, users) {
		var _company = {};
		companies.forEach(function(item) {
			_company[item._id] = item.name;
		});
		users.forEach(function(user) {
			user.company_name = _company[user.company_id] || '';
		});
		res.render('user', {
			companies: companies,
			users: users
		});
	});
	Company.findCompanies({}, ep.done('companies'));
	User.findUsers({}, ep.done('users'));
});

router.post('/add.html', function(req, res) {
	var user = req.param('user');
	if (user && user.id && user.name && user.password) {
		if (user.password !== user.retryPassword) {
			return res.json(message('pswNotIdentical'));
		}
		return async.waterfall([function(callback) {
			User.findOneUser({
				id: user.id
			}, function(error, _user) {
				if (!error && _user) {
					error = failObject('alreadyExist');
				}
				callback(error);
			});
		}, function(callback) {
			user.password = md5(user.password);
			User.saveUser(user, callback);
		}], handler(res, function() {
			res.json({
				status: 'success',
				message: 'Saved.'
			});
		}));
	}
	res.json({
		status: 'error',
		message: 'User info is incomplete.'
	});
});

router.post('/update.html', function (req, res) {
	var user = req.param('user');
	if (user && user.id && user.name && user.password) {
		return async.waterfall([function(callback) {
			User.findOneUser({
				id: user.id
			}, function(error, _user) {
				if (!error && !_user) {
					error = failObject('notExist');
				}
				callback(error, _user);
			});
		}, function(_user, callback) {
			user.password = md5(user.password);

			_.assign(_user, user);
			if (!user.company_id) {
				_user.company_id = null;
			}
			delete _user.id;
			User.updateUser(_user.id, _user, callback);
		}], handler(res, function() {
			res.json({
				status: 'success',
				message: 'Updated.'
			});
		}));
	}
	res.json({
		status: 'error',
		message: 'User info is incomplete.'
	});
});

router.post('/remove.html', function(req, res) {
	var id = req.param('id');
	if (id) {
		return User.removeUser({
			id: id
		}, handler(res, function() {
			res.json({
				status: 'success',
				message: 'User Deleted.'
			});
		}));
	}
	res.json({
		status: 'error',
		message: 'Please specify which user you want to detele.'
	});
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