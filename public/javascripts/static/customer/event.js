/**
 * Created by Carlis on 4/10/15.
 */

define(function (require) {
    var $ = require('jquery');
    var Customer = require('./customer')

    $('#save-customer').click(function (e) {
        var customer = new Customer('#customer-form');
        customer.save(function (err, data) {
            if (err) {
                console.error(err);
            } else {
                console.log('saved');
                console.log(data);
            }
        });
    });
});