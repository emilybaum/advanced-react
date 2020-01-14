const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// decode the jwt so we can get the user ID on each request 
server.express.use((req, res, next) => {
    const{ token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET)
        // put userId onto the req for future requests 
        req.userId = userId 
    }
    next();
});

// 2. creaste middleware that populates the user on each request

server.express.use(async (req, res, next) => {
    // if they are not logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user({ where: { id: req.userId } }, `{id, permissions, email, name}`
    );
    req.user = user;
    next()
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL,
        },
    },
    deets => {
        console.log(`Server is running on http://localhost:${deets.port}`)
    }
)