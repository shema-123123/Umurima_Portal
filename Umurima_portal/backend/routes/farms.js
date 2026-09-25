const express = require('express');
const Farm = require('../models/Farm');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const farm = await Farm.create({ ...req.body, userId: req.user._id });
    res.status(201).json(farm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-farms', protect, async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(farms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const farms = await Farm.find()
      .populate('userId', 'username identityNumber telephone location')
      .sort({ createdAt: -1 });
    res.json(farms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Umurima ntubonetse' });

    if (
      req.user.role !== 'admin' &&
      farm.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Ntibyemewe' });
    }

    Object.assign(farm, req.body);
    await farm.save();
    res.json(farm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Umurima ntubonetse' });

    if (
      req.user.role !== 'admin' &&
      farm.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Ntibyemewe' });
    }

    await farm.deleteOne();
    res.json({ message: 'Umurima wasibwe' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;