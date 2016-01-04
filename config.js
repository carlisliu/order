/**
 * Created by Carlis on 4/8/15.
 */

var db = {
    ip: '127.0.0.1',
    schema: 'order',
    username: 'root',
    password: 'root'
};
//'mongodb://127.0.0.1/order'
db.url = 'mongodb://' + db.ip + ':' + (db.port || 27017) + '/' + db.schema;
//mongodb://root:root@localhost:27017/order
var dbUri = 'mongodb://' + ((db.username && db.password) ? (db.username + ':' + db.password + '@') : '') + db.ip + ':' + (db.port || 27017) + '/' + db.schema;
var config = {
    db: db,
    dbUri: 'mongodb://root:root@localhost:27017/order',
    productUploadPath: '/upload/products',
    staticServer: '',
    page: {
        pageSize: 10,
        paginationSize: 5
    },
    host: {
        production: 'http://order.5lym.com',
        development: ''
    }
};
module.exports = config;