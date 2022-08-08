const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const { validateUserCreate, validateUserLogin } = require('./middlewares/celebrate');

const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handle-errors');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();

app.use(cookieParser());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { createUser, login } = require('./controllers/users');

app.post('/signup', validateUserCreate, createUser);

app.post('/signin', validateUserLogin, login);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
