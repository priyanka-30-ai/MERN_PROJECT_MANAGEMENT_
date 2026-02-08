require('dotenv').config({ path: __dirname + '/../.env' }); // since dbConfig.js is in server/config
const mongoose = require("mongoose");

console.log("ENV VARIABLES:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo db connected successfully");
});

connection.on("error", (err) => {
  console.log("Mongo db connection error: ", err);
});

module.exports = mongoose;
