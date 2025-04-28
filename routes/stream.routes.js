// backend/routes/stream.routes.js
import express from 'express';
import {
  createStream,
  getAllStreams,
  getMyStream,
  stopStream,
  tipStreamer,
} from '../controller/stream.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createStream);
router.get('/', getAllStreams);
router.get('/me', authMiddleware, getMyStream);
router.post('/:id/stop', authMiddleware, stopStream);
router.post('/:id/tip', authMiddleware, tipStreamer);

export default router;
