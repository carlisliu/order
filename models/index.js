import mongoose from 'mongoose';
import _debugger from 'debug';
import Category from './category';
import Order from './order';
import Product from './product';

const debug = _debugger('models/index');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/order', {
    db: {
        native_parser: true
    },
    user: 'root',
    pass: 'root'
}, function(err) {
    if (err) {
        console.log(err);
        debug('connect error: ', err);
        process.exit(1);
    }
});

export {Category, Order, Product}