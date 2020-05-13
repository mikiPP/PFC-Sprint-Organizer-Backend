const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const companyRoutes = require('./Routes/companyRoutes');
const projectRoutes = require('./Routes/projectRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/company', companyRoutes, bodyParser);
app.use('/project', projectRoutes, bodyParser);

mongoose
  .connect(
    'mongodb+srv://node:XGeSsA5LgqKV8%23D@cluster0-zpnkm.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.error(err));
