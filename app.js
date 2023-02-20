const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();


app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/note', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

    
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8000;
  }
  
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((result) => {
      app.listen(port, function () {
        console.log("server started successfully");
      });
    })
    .catch((err) => {
      console.log(err);
    });