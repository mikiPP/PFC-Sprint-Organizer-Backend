const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const companyRoutes = require('./Routes/company');

const app = express();

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/company', companyRoutes);

server.listen(8080);
