const {
  DEFAULT_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOTFOUND_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} = require('../utils/errors');

const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Пользователи не найдены.' });
        return;
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '400 — Переданы некорректные данные _id.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '400 — Переданы некорректные данные _id.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
