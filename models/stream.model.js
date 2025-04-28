// backend/models/stream.model.js
import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  message: String,
  time: { type: Date, default: Date.now },
});

const streamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  streamer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: "General", // optional default category
  },
  thumbnail: {
    type: String,
  },
  streamKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['live', 'offline'], default: 'offline' },
  startedAt: Date,
  endedAt: Date,
  tipHistory: [tipSchema],
  playbackUrl: {
    type: String, // HLS or WebRTC playback URL
  },
  scheduledAt: {
    type: Date, // For future scheduled streams
  },
  // Metrics
  viewerCount: { type: Number, default: 0 },
  totalTips: { type: Number, default: 0 },
});

const Stream = mongoose.model('Stream', streamSchema);

export default Stream;
