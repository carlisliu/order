/**
 * Created by Carlis on 4/10/15.
 */
var express = require('express');
var router = express.Router();
var Customer = require('../proxy').Customer;

/* GET home page. */
router.get('/index.html', function (req, res) {
    res.render('customer', { title: 'customer' });
});

router.post('/add.html', function (req, res) {
    var customer = req.param('customer');
    console.log(customer);
    res.json({msg: 'success'});
});

router.post('/remove.html', function (req, res) {
    var id = req.param('id');
    console.log(id);
    Customer.removeCustomerById(id, function (err) {
        if (err) {
            res.json({msg: 'Error'});
        } else {
            res.json({msg: 'Removed'});
        }
    });
});

module.exports = router;
