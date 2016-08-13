import mongoose from 'mongoose';
import _debugger from 'debug';
import Category from './category';
import Order from './order';
import Product from './product';
import User from './user';

const debug = _debugger('models/index');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://172.17.0.2/order', /*{
    db: {
        native_parser: true
    },
    user: 'root',
    pass: 'root'
},*/ function(err) {
    if (err) {
        console.log(err);
        debug('connect error: ', err);
        process.exit(1);
    }
});

export {Category, Order, Product, User}