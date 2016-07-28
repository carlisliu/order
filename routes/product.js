import Router from 'koa-router';

const router = new Router();

router.get('/:id', async function(ctx, next) {
    ctx.state = {
        title: 'product detail'
    };

    await ctx.render('product/detail', {});
});

module.exports = router;