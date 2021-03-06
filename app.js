const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
// const https = require('https');
// const fs = require('fs');

const isAuth = require('./middleware/isAuth');
const authRoutes = require('./Routes/authRoutes');
const companyRoutes = require('./Routes/companyRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const statusRoutes = require('./Routes/statusRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');
const sprintRoutes = require('./Routes/sprintRoutes');
const imputationRoutes = require('./Routes/imputationRoutes');
const permissionRoutes = require('./Routes/permissionRoutes');
const roleRoutes = require('./Routes/roleRoutes');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

const BASE_PATH = '/api';

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/company`, isAuth, companyRoutes, bodyParser);
app.use(`${BASE_PATH}/project`, isAuth, projectRoutes, bodyParser);
app.use(`${BASE_PATH}/task`, isAuth, taskRoutes, bodyParser);
app.use(`${BASE_PATH}/status`, isAuth, statusRoutes, bodyParser);
app.use(`${BASE_PATH}/employee`, isAuth, employeeRoutes, bodyParser);
app.use(`${BASE_PATH}/sprint`, isAuth, sprintRoutes, bodyParser);
app.use(`${BASE_PATH}/imputation`, isAuth, imputationRoutes, bodyParser);
app.use(`${BASE_PATH}/permission`, isAuth, permissionRoutes, bodyParser);
app.use(`${BASE_PATH}/role`, isAuth, roleRoutes, bodyParser);

// app.use(`/auth`, authRoutes);
// app.use('/company', isAuth, companyRoutes, bodyParser);
// app.use('/project', isAuth, projectRoutes, bodyParser);
// app.use('/task', isAuth, taskRoutes, bodyParser);
// app.use('/status', isAuth, statusRoutes, bodyParser);
// app.use('/employee', isAuth, employeeRoutes, bodyParser);
// app.use('/sprint', isAuth, sprintRoutes, bodyParser);
// app.use('/imputation', isAuth, imputationRoutes, bodyParser);
// app.use('/permission', isAuth, permissionRoutes, bodyParser);
// app.use('/role', isAuth, roleRoutes, bodyParser);

app.use((req, res, next) => {
  res.setHeader('Acess-Controll-Allow-Origin', '*');
  res.setHeader(
    'Acess-Controll-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zpnkm.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.error(err));
