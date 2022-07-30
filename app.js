const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const {
  NOTFOUND_ERROR_CODE,
} = require('./utils/errors');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62d59ec8cf56e951d6f7ed3a',
  };
  next();
});

app.use('/', routesUsers);
app.use('/cards', routesCards);

app.use((req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
