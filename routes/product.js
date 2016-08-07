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

router.get('/:productId', async function(ctx, next) {
    const params = ctx.req.query || {};
    let productId = params.productId;

    if (!productId) {
        return next();
    }

    let product = await productService.findProductById(productId);

    await ctx.render('product/detail', state({
        title: 'Order detail'
    }));
});

router.put('/', async function  (ctx, next) {
    const product = (this.body || {}).product;

    validate(product);

    let savedProduct = await productService.save(product);

    ctx.body = state({
        product: savedProduct
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
        next();
    }

    await productService.remove(productId);

    ctx.body = state({
        message: 'product deleted!'
    });
});

function validate (product) {
    assert(product, 'product is empty.');
    assert(product.name, "product's name is empty.");
    assert(product.price, "product's name is empty.");
}

module.exports = router;