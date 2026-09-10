const jwt = require('jsonwebtoken');
const config = require('../config');

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

module.exports = { signToken };
