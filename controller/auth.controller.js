// backend/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import {User} from "../models/index.js"
import dotenv from "dotenv"

dotenv.config()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
// get all user


export const registerUser = async (req, res) => {
  const { username, email, password, role ,name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username,name, email, password, role });
    res.status(201).json({
      success:true,
      user: user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success:true,
        user,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({success:false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
