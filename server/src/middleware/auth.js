const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'doctor_appointment_secret_key_2026';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Missing or malformed token.',
      error: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user no longer exists.',
        error: 'USER_NOT_FOUND'
      });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token has expired.',
      error: 'INVALID_TOKEN'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
        error: 'FORBIDDEN'
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  JWT_SECRET
};
