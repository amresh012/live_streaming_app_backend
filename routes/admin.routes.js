// backend/routes/admin.routes.js
import express from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  getStreamStats,
  getAllUsers,
  getEarningsReport,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/stream-stats', getStreamStats);
router.get('/users', getAllUsers);
router.get('/earnings', getEarningsReport);

export default router;
