const User = require('../models/user');

const defErrMsg = '500 — Внутренняя ошибка сервера';

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(data: user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: '404 — Не найдено' });
        return;
      }
      res.status(200).send(data: users);
    })
    .catch(() => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: '404 — Не найдено' });
      }
      res.status(200).send(data: user);
    })
    .catch(() => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then((user) => {
      res.status(200).send(data: user);
    })
    .catch((err) => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then((user) => {
      res.status(200).send(data: user);
    })
    .catch((err) => {
      res.status(500).send({ message: `${defErrMsg}`});
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar
};
