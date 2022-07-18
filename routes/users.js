const routesUsers = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routesUsers.post('/users', createUser);
routesUsers.get('/users', getUsers);
routesUsers.get('/users/:id', getUser);
routesUsers.patch('/users/me', updateUser);
routesUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routesUsers;
