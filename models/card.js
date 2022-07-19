const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле {PATH} не может быть пустым.'],
    minlength: [2, 'Поле {PATH} должно содержать минимум два символа.'],
    maxlength: [30, 'Поле {PATH} может содержать максимум 30 символов.'],
  },
  link: {
    type: String,
    required: [true, 'Поле {PATH} не может быть пустым.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
