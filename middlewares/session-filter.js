const ignorePath = [];

export async function (ctx, next) {
    const url = ctx.req.url || ctx.req.originalUrl;
    for (let path of ignorePath) {
        if (path.test(url)) {
            return await next();
        }
    }
    if (!ctx.req.session) {
        return ctx.res.redirect('login');
    }
    await next();
}