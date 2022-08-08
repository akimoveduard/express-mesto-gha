const { celebrate, Joi } = require('celebrate');
const { imgUrlRegExp } = require('../utils/regexp');

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(imgUrlRegExp),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCardPost = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(imgUrlRegExp),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
    .messages({
      'string.length': 'Длина id карточки должна быть 24 символа.',
    }),
});

module.exports = {
  validateUserCreate,
  validateUserLogin,
  validateCardPost,
  validateCardId,
};
