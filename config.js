/**
 * Created by Carlis on 4/8/15.
 */

var config = {
//    db: 'mongodb://{username}:{password}@127.0.0.1/carlis_blog_prod',
    db: 'mongodb://127.0.0.1/order',
    db_name: 'order',
    username: 'root',
    password: 'root@order',
    productUploadPath: '/upload/products',
    page: {
        pageSize: 10,
        paginationSize: 5
    }
};
module.exports = config;