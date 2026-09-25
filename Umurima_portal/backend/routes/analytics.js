const express = require('express');
const User = require('../models/User');
const Farm = require('../models/Farm');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFarms = await Farm.countDocuments();

    const totalSizeAgg = await Farm.aggregate([
      { $group: { _id: null, total: { $sum: '$size' } } },
    ]);

    const totalTreesAgg = await Farm.aggregate([
      { $group: { _id: null, total: { $sum: '$treeCount' } } },
    ]);

    const cropsAgg = await Farm.aggregate([
      {
        $group: {
          _id: '$cropType',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const farmsByLocation = await Farm.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const treesAgg = await Farm.aggregate([
      { $unwind: '$treeTypes' },
      { $group: { _id: '$treeTypes', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalUsers,
      totalFarms,
      totalSize: totalSizeAgg[0]?.total || 0,
      totalTrees: totalTreesAgg[0]?.total || 0,
      crops: cropsAgg,
      locations: farmsByLocation,
      trees: treesAgg,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;