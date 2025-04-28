// backend/controllers/admin.controller.js
import {User,Stream} from "../models/index"

export const getStreamStats = async (req, res) => {
  try {
    const liveCount = await Stream.countDocuments({ status: 'live' });
    const totalTips = await Stream.aggregate([
      { $group: { _id: null, total: { $sum: '$totalTips' } } },
    ]);

    res.json({
      liveStreams: liveCount,
      totalTips: totalTips[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stream stats' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getEarningsReport = async (req, res) => {
  try {
    const earnings = await User.aggregate([
      { $match: { role: 'streamer' } },
      { $project: { username: 1, walletBalance: 1 } },
    ]);
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings report' });
  }
};
