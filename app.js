const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62d1798ea65418fede6e625d',
  };
  next();
});

app.use('/', routesUsers);

app.use('/', routesCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
