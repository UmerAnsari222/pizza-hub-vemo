const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/pizza";

function connection() {
  mongoose
    .connect(url)
    .then(() => {
      console.log("database connection established");
    })
    .catch(() => {
      console.error("database connection is failed");
    });
}

module.exports = connection;
