const routesCards = require('express').Router();

const { createCard, getCards, deleteCard, likeCard, deleteLike } = require('../controllers/cards');

routesCards.post('/cards', createCard);
routesCards.get('/cards', getCards);
routesCards.delete('/cards/:cardId', deleteCard);
routesCards.put('/cards/:cardId/likes', likeCard);
routesCards.delete('/cards/:cardId/likes', deleteLike)

module.exports = routesCards;
