const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.get('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Ntibyemewe' });
  }
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Umukoresha ntabonetse' });
  res.json(user);
});

router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Ntibyemewe' });
  }
  try {
    const { username, telephone, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, telephone, location },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Umukoresha ntabonetse' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Umukoresha ntabonetse' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Ntushobora gusiba admin' });
    }
    await user.deleteOne();
    res.json({ message: 'Umukoresha yasibwe' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;