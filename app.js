const express = require('express');
const mongoose = require('mongoose');

const { celebrate, Joi, errors } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handle-errors');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { imgUrlRegExp } = require('./utils/regexp');

const app = express();

app.use(cookieParser());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { createUser, login } = require('./controllers/users');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(imgUrlRegExp),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
