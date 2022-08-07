const routesUsers = require('express').Router();

const {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routesUsers.get('/', getUsers);
routesUsers.get('/me', getCurrentUserInfo);
routesUsers.get('/:id', getUser);
routesUsers.patch('/me', updateUser);
routesUsers.patch('/me/avatar', updateAvatar);

module.exports = routesUsers;
