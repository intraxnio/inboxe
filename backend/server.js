const express = require('express');
const jwt = require("jsonwebtoken");
const dbConnection = require("./db");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
dbConnection();
const usersOnBoard = require("./routes/usersOn");
const urls = require("./routes/urls");
const URL = require("../backend/models/Url");
const userAgent = require("express-useragent");
const axios = require("axios");
app.use(express.json());
app.use(userAgent.express());
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200,
  changeOrigin: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});



app.use("/usersOn", usersOnBoard);
app.use("/url", urls);



//create server
const server = app.listen(8001, () => {
  console.log('Server is running on 8001');
});





