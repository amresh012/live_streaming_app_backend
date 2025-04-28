// backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from "express-async-handler"


export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'User not found. Unauthorized.' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized. Token expired or invalid.' });
    }
  } else {
    return res.status(401).json({ error: 'No token provided. Authorization denied.' });
  }
});



export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const isStreamer = (req, res, next) => {
  if (req.user?.role !== 'streamer') {
    return res.status(403).json({ message: 'Streamer access required' });
  }
  next();
};
