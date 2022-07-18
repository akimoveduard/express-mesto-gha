const routesUsers = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routesUsers.post('/', createUser);
routesUsers.get('/', getUsers);
routesUsers.get('/:id', getUser);
routesUsers.patch('/me', updateUser);
routesUsers.patch('/me/avatar', updateAvatar);

module.exports = routesUsers;
