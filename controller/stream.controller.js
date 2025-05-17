// backend/controllers/stream.controller.js
import {User,Stream} from '../models/index.js';
import crypto from "crypto"


export const createStream = async (req, res) => {
  try {
    const { title, description, category, scheduledAt } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduled date" });
      }
      // if (scheduledDate < new Date()) {
      //   return res.status(400).json({ message: "Scheduled date must be in the future" });
      // }
    }

    const streamKey = crypto.randomBytes(16).toString("hex");

    const newStream = new Stream({
      streamer: req.user._id,
      title,
      description,
      category,
      streamKey,
      scheduledAt,
    });

    await newStream.save();

    res.status(201).json({
      success: true,
      stream: newStream,
    });
  } catch (error) {
    console.error("Error creating stream:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ status: 'offline' }).populate('streamer', 'username');
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