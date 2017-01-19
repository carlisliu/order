/**
 * Created by Carlis on 4/8/15.
 */
var util = require('util');

var config = {
    'development': {
        db: {
            ip: '127.0.0.1',
            schema: 'order',
            username: 'root',
            password: 'root'
        },
        productUploadPath: '/upload/products',
        staticServer: 'http://localhost:4000',
        staticResourcePath: '',
        page: {
            pageSize: 10,
            paginationSize: 5
        },
        host: 'http://localorder.5lym.com'
    },
    'production': {
        db: {
            ip: '127.0.0.1',
            schema: 'order',
            username: 'root',
            password: 'root'
        },
        productUploadPath: '/upload/products',
        staticServer: 'http://static.5lym.com',
        staticResourcePath: '/dist',
        page: {
            pageSize: 10,
            paginationSize: 5
        },
        host: 'http://order.5lym.com'
    }
};

for (var key in config) {
    var db = config[key].db;
    //'mongodb://127.0.0.1/order'
    db.url = util.format('mongodb://%s:%d/%s', db.ip, (db.port || 27017), db.schema);
    //mongodb://root:root@localhost:27017/order
    config[key].dbUri = util.format('mongodb://%s%s:%d/%s',  ((db.username && db.password) ? (db.username + ':' + db.password + '@') : ''), db.ip, (db.port || 27017), db.schema);
}

module.exports = config[process.env.NODE_ENV || 'development'];