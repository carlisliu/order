import Router from 'koa-router';
import state from './state';
import * as productService from '../services/product';
import assert from 'assert';

const router = new Router();

router.get('/', async function(ctx, next) {
    const params = ctx.req.query || {};

    let products = await productService.findProducts(params.page, params.pageSize);

    await ctx.render('product/detail', state({
        title: 'Orders',
        products: products
    }));
});

router.get('/hot', async function(ctx, next) {
    let products = await productService.findHotProducts();
    await ctx.render('product/detail', state({
        title: 'Order detail',
        products: products
    }));
});

router.get('/:productId', async function(ctx, next) {
    const params = ctx.req.query || {};
    let productId = params.productId;

    if (!productId) {
        return next();
    }

    let product = await productService.findProductById(productId);

    await ctx.render('product/detail', state({
        title: 'Order detail',
        product: product
    }));
});

router.put('/', async function(ctx, next) {
    const product = (this.body || {}).product;

    validate(product);

    await productService.save(product).then(function() {
        ctx.body = state();
    }).catch(function(e) {
        ctx.body = state({
            status: 'error',
            message: e && e.message || 'Error'
        });
    });
});

router.post('/', async function(ctx, next) {
    const product = (this.body || {}).product;

    validate(product);

    let updatedProduct = await productService.update(product);

    ctx.body = state({
        product: updatedProduct
    });
});

router.delete('/:productId', async function(ctx, next) {
    const productId = (this.body || {}).productId;

    if (!productId) {
        this.throw(404);
    }

    await productService.remove(productId);

    ctx.body = state({
        message: 'product deleted!'
    });
});

function validate(product) {
    assert(product, 'product is empty.');
    assert(product.name, "product's name is empty.");
    assert(product.price, "product's name is empty.");
}

module.exports = router;