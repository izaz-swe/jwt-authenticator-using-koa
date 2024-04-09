const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const { jwtSecret } = require('./variable');
const jwt = require("jsonwebtoken");
const verifyToken = require('./verifyToken');


const app = new Koa();
const router = new Router();

router.post('/login', async (ctx) => {
    const { aud, userId } = ctx.request.body;
    if (!aud && !userId) {
        ctx.status = 401;
        ctx.body = { error: 'Aud & userId Not Provided' };
        return;
    }
    else if (!aud) {
        ctx.status = 401;
        ctx.body = { error: 'Aud Not Provided' };
        return;
    } else if (!userId) {
        ctx.status = 401;
        ctx.body = { error: 'UserId Not Provided' };
        return;
    }
    const token = jwt.sign({ aud, userId }, jwtSecret, {
        expiresIn: "1h",
    });
    ctx.body = {token : token};
});
router.get('/dashboard', verifyToken, async (ctx) => {
    ctx.body = {
        aud: ctx.state.user.aud,
        userId: ctx.state.user.userId,
    };
});
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8088, () => {
    console.log('Server is running on http://localhost:8088');
});