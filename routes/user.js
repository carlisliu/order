import Router from 'koa-router';

const router = new Router();

router.get('/', function(ctx, next) {
    ctx.body = 'users';
});

router.post('/', async function(ctx, next) {
    var user = ctx.body.user;
    if (user) {
        ctx.state = {
            title: 'add user'
        };

        return await ctx.render('detail', {});
    }
    await ctx.render('detail');
});

router.delete('/:id', async function(ctx, next) {
    var id = ctx.params.id;
    if (id) {
        ctx.state = {
            title: 'koa2 title'
        };

        return await ctx.render('detail', {});
    }
    await ctx.render('detail');
});

module.exports = router;