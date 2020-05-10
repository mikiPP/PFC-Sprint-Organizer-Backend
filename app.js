// const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const companyRoutes = require('./Routes/companyRoutes');

const app = express();

// const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/company', companyRoutes);

mongoose
  .connect(
    'mongodb+srv://node:XGeSsA5LgqKV8%23D@cluster0-zpnkm.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.error(err));
