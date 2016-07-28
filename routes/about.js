import Router from 'koa-router';

const router = new Router();

router.get('/', function(ctx, next) {
    ctx.body = 'about';
});

module.exports = router;