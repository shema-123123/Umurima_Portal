const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { username, identityNumber, telephone, location, password } = req.body;

    if (!username || !identityNumber || !telephone || !location || !password) {
      return res.status(400).json({ message: 'Uzuza amakuru yose' });
    }

    const exists = await User.findOne({
      $or: [{ username }, { identityNumber }],
    });
    if (exists) {
      return res.status(400).json({
        message: 'Username cyangwa Indangamuntu isanzwe ikoreshwa',
      });
    }

    const user = await User.create({
      username,
      identityNumber,
      telephone,
      location,
      password,
      role: 'user',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      identityNumber: user.identityNumber,
      telephone: user.telephone,
      location: user.location,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Uzuza username na password' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Username cyangwa password itemewe' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      identityNumber: user.identityNumber,
      telephone: user.telephone,
      location: user.location,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;