import Router from 'koa-router';
import orderService from '../services/order';

const router = new Router();

router.get('/index.html', async function(ctx, next) {

    const orders = await orderService.queryOrders();

    await ctx.render('order/index', state({
        title: 'Order',
        orders: orders
    }));
});

router.get('/', async function(ctx, next) {

    const orders = await orderService.queryOrders();

    ctx.body = state({
        orders: orders
    });
});

router.get('/:orderId', async function(ctx, next) {
    const orderId = (ctx.req.query || {}).orderId;

    if (!orderId) {
        return next();
    }

    const order = await orderService.queryOrderById(orderId);

    await ctx.render('order/detail', state({
        title: 'Order detail',
        order: order
    }));
});

router.put('/', async function(ctx, next) {

    if (!ctx.req.session) {
        return next();
    }

    let order = (ctx.body || {}).order;

    validate(order);

    order = await orderService.save(order);

    this.body = state({
        order: order
    });
});

router.post('/', async function(ctx, next) {
    let order = (ctx.body || {}).order;

    validate(order);

    order = await orderService.update(order);

    this.body = state({
        order: order
    });
});

router.delete('/:orderId', async function(ctx, next) {
    const orderId = (ctx.req.query || {}).orderId;

    await orderService.deleteById(orderId);

    this.body = state({
        message: 'deleted'
    });
});

function validate(order) {
    assert(order, 'order is empty.');
    assert(order.user, "order's user is empty.");
    assert(order.address, "order's address is empty.");
    assert(order.details && order.details.length, "order's detail is empty.");
    order.details.forEach(function(detail) {
        assert(detail, 'detail is empty.');
        assert(detail.product, "detail's product is empty.");
    });
}

module.exports = router;