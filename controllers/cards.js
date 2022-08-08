const Card = require('../models/card');
const ErrorBadRequest = require('../utils/errors/bad-request');
const ErrorNotFound = require('../utils/errors/not-found');
const ErrorForbidden = require('../utils/errors/forbidden');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.payload;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new ErrorBadRequest('Переданы некорректные данные для создания карточки.');
      }
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('С указанным id карточка не найдена.'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new ErrorBadRequest('Передан некорректный id карточки.');
      }
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена.'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new ErrorBadRequest('Передан некорректный id карточки.');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена.'));
        return;
      }
      if (JSON.stringify(card.owner) === JSON.stringify(req.user.payload)) {
        card.remove();
      } else {
        throw new ErrorForbidden('Нельзя удалять чужие карточки.');
      }
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка удалена.' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new ErrorBadRequest('Передан некорректный id карточки.');
      }
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  likeCard,
  deleteLike,
  deleteCard,
};
