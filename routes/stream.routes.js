// backend/routes/stream.routes.js
import express from 'express';
import {
  createStream,
  getAllStreams,
  getMyStream,
  stopStream,
  tipStreamer,
} from '../controller/stream.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createStream);
router.get('/', getAllStreams);
router.get('/me', protect, getMyStream);
router.post('/:id/stop', protect, stopStream);
router.post('/:id/tip', protect, tipStreamer);

export default router;
