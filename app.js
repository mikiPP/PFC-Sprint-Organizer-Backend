const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const companyRoutes = require('./Routes/companyRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const statusRoutes = require('./Routes/statusRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/company', companyRoutes, bodyParser);
app.use('/project', projectRoutes, bodyParser);
app.use('/task', taskRoutes, bodyParser);
app.use('/status', statusRoutes, bodyParser);
app.use('/employee', employeeRoutes, bodyParser);

app.use((req, res, next) => {
  res.setHeader('Acess-Controll-Allow-Origin', '*');
  res.setHeader(
    'Acess-Controll-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Acess-Controll-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/company', companyRoutes);
app.use('/project', projectRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    'mongodb+srv://node:XGeSsA5LgqKV8%23D@cluster0-zpnkm.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.error(err));
