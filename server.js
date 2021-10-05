require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const PORT = process.env.PORT || 3300;

// Database connection
const url = "mongodb://localhost:27017/pizza";

const connection = require("./app/db/database");
connection();

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

// Assets
app.use(express.static("public"));

app.use(express.json());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
