import jwt from 'jsonwebtoken'
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication  failed',

    });
  }
};