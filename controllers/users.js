const bcrypt = require('bcrypt');
const User = require('../models/user');
const getJwtToken = require('../utils/jwt');

const ErrorBadRequest = require('../utils/errors/bad-request'); // 400
const ErrorNotFound = require('../utils/errors/not-found'); // 404
const ErrorConflict = require('../utils/errors/conflict'); // 409
const ErrorUnauthorized = require('../utils/errors/unauthorized');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  if (!email || !password) {
    throw new ErrorBadRequest('Не указаны почта или пароль.');
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы невалидные данные для регистрации пользователя.'));
          }

          if (error.code === 11000) {
            next(new ErrorConflict('Пользователь с такой почтой уже зарегистрирован.'));
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorBadRequest('Не указаны почта или пароль.');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      const token = getJwtToken(user._id);
      res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .status(200)
        .send({ message: 'Успешная авторизация.' });
    })
    .catch(() => {
      next(new ErrorUnauthorized('Неправильные почта или пароль.'));
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 1) {
        throw new ErrorNotFound('Пользователи не найдены.');
      }
      res.status(200).send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') throw new ErrorBadRequest('Некорректный id пользователя.');
    })
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user.payload)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.payload,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректные данные для обновления профиля.'));
      }
      next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.payload,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new ErrorBadRequest('Некорректные данные для обновления аватара.');
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUser,
  updateAvatar,
};
