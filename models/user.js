const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле {PATH} не может быть пустым.'],
    minlength: [2, 'Поле {PATH} должно содержать минимум два символа.'],
    maxlength: [30, 'Поле {PATH} может содержать максимум 30 символов.'],
  },
  about: {
    type: String,
    required: [true, 'Поле {PATH} не может быть пустым.'],
    minlength: [2, 'в профиле должно быть минимум два символа.'],
    maxlength: [30, 'в профиле может быть максимум 30 символов.'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле {PATH} не может быть пустым.'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
