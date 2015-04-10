/**
 * Created by Carlis on 4/10/15.
 */

var index = require('./routes/index');
var users = require('./routes/users');
var customer = require('./routes/customer');

module.exports = function (app) {
    app.use('/', index);
    app.use('/users', users);
    app.use('/customer', customer);
};