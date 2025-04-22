// backend/controllers/stream.controller.js
import Stream from '../models/stream.model.js';
import User from '../models/user.model.js';
import { nanoid } from 'nanoid';

export const createStream = async (req, res) => {
  try {
    const streamKey = nanoid();
    const stream = await Stream.create({
      title: req.body.title,
      streamer: req.user._id,
      streamKey,
      status: 'live',
      startedAt: new Date(),
    });
    res.status(201).json(stream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ status: 'live' }).populate('streamer', 'username');
    res.json(streams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyStream = async (req, res) => {
  try {
    const stream = await Stream.findOne({ streamer: req.user._id });
    if (!stream) return res.status(404).json({ message: 'No active stream' });
    res.json(stream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const stopStream = async (req, res) => {
  try {
    const stream = await Stream.findOne({ _id: req.params.id, streamer: req.user._id });
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    stream.status = 'offline';
    stream.endedAt = new Date();
    await stream.save();

    res.json({ message: 'Stream stopped' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const tipStreamer = async (req, res) => {
  try {
    const { amount, message } = req.body;
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    const tip = {
      userId: req.user._id,
      amount,
      message,
    };
    stream.tipHistory.push(tip);
    stream.totalTips += amount;
    await stream.save();

    await User.findByIdAndUpdate(stream.streamer, { $inc: { walletBalance: amount } });

    res.json({ message: 'Tip sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: update viewer count if using socket events
export const updateViewerCount = async (streamId, delta) => {
  try {
    await Stream.findByIdAndUpdate(streamId, { $inc: { viewerCount: delta } });
  } catch (err) {
    console.error('Viewer count update error:', err.message);
  }
};