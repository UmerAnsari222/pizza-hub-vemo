require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require('events')


const PORT = process.env.PORT || 3300;

// Database connection
const url = "mongodb://localhost:27017/pizza";
const connection = require("./app/db/database");
connection();


// Event emitter

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: url,
    }),
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(flash());

// Passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());



// Assets
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


const io = require("socket.io")(server)

io.on("connection", (socket) => {

  socket.on('join', (orderId) => {
    socket.join(orderId);
  })

})


eventEmitter.on('orderUpdate', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdate', data)
})

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data)
})