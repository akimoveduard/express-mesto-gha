const mongoose = require('mongoose');

const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Нужно хотя бы 2 символа.'],
    maxlength: [30, 'Максимальная длина — 30 символов.'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(avatar) {
        return /http:\/\/(.+?)\/(([a-zA-Z0-9_ \-%.]*)\.(jpg|png|jpeg|gif|webp))/.test(avatar);
      },
      message: 'Неверный url изображения.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
