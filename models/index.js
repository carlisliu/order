import mongoose from 'mongoose';
import _debugger from 'debug';
import Category from './category';
import Order from './order';
import Product from './product';
import User from './user';
import Organization from './organization';

const debug = _debugger('models/index');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/order', /*{
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
    console.log("We're connected.");
});

export {
    Category,
    Order,
    Product,
    User,
    Organization
};