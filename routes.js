/**
 * Created by Carlis on 4/10/15.
 */

var index = require('./routes/index');
var users = require('./routes/users');
var customer = require('./routes/customer');
var category = require('./routes/category');
var product = require('./routes/product');
var order = require('./routes/order');
var company = require('./routes/company');
var api = require('./routes/api');

module.exports = function(app) {
	app.use('/', index);
	app.use(function(req, res, next) {
		if (!req.xhr && req.session.user && !req.session.user.company && req.url.indexOf('logout') < 0) {
			return res.redirect('/');
		}
		next();
	});
	app.use('/users', users);
	app.use('/customer', customer);
	app.use('/category', category);
	app.use('/product', product);
	app.use('/order', order);
	app.use('/company', company);
	app.use('/api', api);
};