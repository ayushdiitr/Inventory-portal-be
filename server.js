const dotenv = require('dotenv')
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config();

var dbHost = process.env.DB_HOST || "localhost";
var dbName = process.env.DB_NAME;
var dbUser = process.env.DB_USERNAME;
var dbPass = process.env.DB_PASSWORD;
var dbPort = process.env.DB_PORT || "27017";

mongoose.connect("mongodb://localhost:27017" , {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Database Connected')
}).catch(err => console.log(err))

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server Started on Port', PORT);
})
