/**
 * Created by Carlis on 4/10/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index.html', function(req, res) {
    res.render('customer', { title: 'customer' });
});

router.post('/add.html', function(req, res){
    console.log('add customer---------------');
    var customer = req.param('customer');
    console.log(customer);
    res.json({msg:'success'});
});

module.exports = router;
