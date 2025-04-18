const express = require("express");
require("dotenv").config({path: './config/.env'});
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./config/db");
const {checkUser, requireAuth} = require('./middleware/auth.middleware')
const cors = require('cors');

const app = express();

const allowedOrigins = process.env.FRONT_URLS.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());


// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

//route
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});