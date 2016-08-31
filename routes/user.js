import Router from 'koa-router';
import state from './state';
import userService from '../services/user';
import assert from 'assert';

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

router.put('/', async function(ctx, next) {
    var user = ctx.body.user;
    validate(user);
    await userService.addUser(user);
    ctx.body = state({
        message: 'user saved!'
    });
});

router.delete('/:id', async function(ctx, next) {
    var id = ctx.params.id;
    if (!id) {
        return next();
    }
    await userService.removeById(id);
    ctx.body = state({
        message: 'user deleted!'
    });
});

function validate(user) {
    assert(user, 'user can not be empty.');
    assert(user.id, "user's id can not be empty.");
    assert(user.name, "user's name can not be empty.");
    assert(user.password, "user's password can not be empty.");
    assert(user.email, "user's email can not be empty.");
}

module.exports = router;