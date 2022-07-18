const Card = require('../models/card');

const defErrMsg = '500 — Внутренняя ошибка сервера';

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(data: card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '400 — Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: '404 — Не найдено'});
        return;
      }
      res.status(200).send(data: cards);
    })
    .catch(() => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: '404 — Карточка не найдена' });
        return;
      }
      res.status(200).send(data: card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400 — Неправильный запрос' });
        return;
      }
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: `${defErrMsg}` });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLike
};
