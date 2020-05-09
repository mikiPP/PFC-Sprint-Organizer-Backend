const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const monogoConect = require('./Util/database').mongoConect;
const companyRoutes = require('./Routes/companyRoutes');

const app = express();

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/company', companyRoutes);

monogoConect(() => {
  app.listen(8080);
});
