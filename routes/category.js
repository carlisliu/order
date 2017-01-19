import Router from 'koa-router';
import state from './state';
import * as categoryService from '../services/category';
import assert from 'assert';

const router = new Router();

router.get('/', async function(ctx, next) {
    await 1;
});

router.get('/:categoryId', async function(ctx, next) {
    const categoryId = (ctx.req.query || {}).categoryId;

    if (!categoryId) {
        return next();
    }

    const category = await categoryService.findOne({
        _id: categoryId
    });

    await ctx.render('category/detail', state({
        title: 'Category detail'
    }));
});

router.put('/', async function(ctx, next) {
    const category = (ctx.body || {}).category;

    validate(category);

    const savedCategory = await categoryService.save(category);

    this.body = state({
        category: savedCategory
    });
});

router.post('/', async function(ctx, next) {
    const category = (ctx.body || {}).category;

    validate(category);

    const updatedCategory = await categoryService.update(category);

    this.body = state({
        category: updatedCategory
    });
});

router.delete('/:categoryId', async function(ctx, next) {
    const categoryId = (ctx.body || {}).categoryId;

    if (!categoryId) {
        return next();
    }

    await categoryService.delete(categoryId);

    this.body = state({
        categoryId: categoryId
    });
});

module.exports = router;