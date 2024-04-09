const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./variable");
const verifyToken = (ctx, next) => {
    try {
      const token = ctx.headers.authorization?.split(" ")[1] || ctx.headers.token;
      if (!token) {
          throw Object.assign(new Error("Toekn Not Found"));
        }
        const decoded = jwt.verify(token, jwtSecret);
        const currentTimestamp = Date.now() / 1000;
        if (decoded.exp && currentTimestamp > decoded.exp) {
            ctx.throw(401,  "Your token has expired");
        }
        ctx.state.user = decoded;
    } catch (err) {
      ctx.throw(401,  "Authentication Failed.");
    }
    return next();
  };

  module.exports = verifyToken;