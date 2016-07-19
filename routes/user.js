var Router = require('koa-router');

var router = new Router();

router.get('/', function(ctx, next) {
    ctx.body = 'users';
});

module.exports = router;